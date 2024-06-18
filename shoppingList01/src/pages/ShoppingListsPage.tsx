import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import { ShoppingList } from "../types/shoppingListTypes";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useNavigate } from "react-router-dom";

const ShoppingListsPage = () => {
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListComment, setNewListComment] = useState("");
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listEntryToDelete, setListEntryToDelete] = useState<ShoppingList>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const closeSnack = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    setOpenSnackbar(false);
    setShowNewListDialog(false);
    setNewListName("");
    setNewListComment("");
  };

  useEffect(() => {
    try {
      fetch("/api/shoppingList?include=shoppingListItem&pageSize=1000").then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setShoppingLists(data.data);
            setLoading(false);
          });
        }
      });
    } catch (error) {
      setErrorMessage("Error loading shopping lists");
      setOpenSnackbar(true);
      console.error(error);
      setLoading(false);
    }
  }, []);

  const getTotalNumberOfItemsAndRemaininInList = (listEntry: ShoppingList) => {
    const totalNumberOfItems = listEntry.shoppingListItem?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const remainingItems = listEntry.shoppingListItem?.reduce((acc, item) => (item.isPurchased ? acc : acc + item.quantity), 0) || 0;
    return (
      <span>
        {totalNumberOfItems || 0} items in list ({remainingItems || 0} remaining)
      </span>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: { xs: "calc(100vh - 3.5rem)", sm: "calc(100vh - 4rem)" },
        pt: "1rem",
        overflow: "hidden",
      }}
    >
      <Container sx={{ display: "flex", flexDirection: "column" }} maxWidth="xl">
        {!loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", mt: 0 }}>
            <Fab color="primary" aria-label="newShoppingList" variant="extended" sx={{ width: "160px" }} onClick={() => setShowNewListDialog(true)}>
              <AddShoppingCartOutlinedIcon />
              <Typography sx={{ ml: 1 }} variant="button">
                Add List
              </Typography>
            </Fab>
          </Box>
        )}

        {loading ? (
          <Typography variant="h6">Loading shopping lists...</Typography>
        ) : (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              mt: 2,
              display: "flex",
              flexDirection: "column",
              scrollbarWidth: "thin",
              overflowY: "auto",
              height: "calc(100vh - 10rem)",
            }}
          >
            {shoppingLists.length === 0 && <Typography variant="h6">No shopping lists found</Typography>}
            {shoppingLists.map((listEntry, i) => (
              <React.Fragment key={listEntry.id}>
                <ListItem
                  sx={{
                    p: 1,
                    borderRadius: i === 0 ? "8px 8px 0 0" : i === shoppingLists.length - 1 ? "0 0 8px 8px" : "0",
                    borderBottom: i === shoppingLists.length - 1 ? "none" : "1px solid #dbdbdb",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setListEntryToDelete(listEntry);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={() => {
                      navigate(`${listEntry.id}`);
                    }}
                    dense
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ShoppingCartIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={listEntry.name}
                      secondary={
                        <span style={{ display: "flex", flexDirection: "column" }}>
                          <span>{listEntry.comment}</span>
                          <span>{getTotalNumberOfItemsAndRemaininInList(listEntry)}</span>
                        </span>
                      }
                      sx={{ height: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Container>
      <Dialog
        open={showNewListDialog}
        PaperProps={{
          component: "form",
          sx: { width: "100%" },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formJson = Object.fromEntries((formData as any).entries());
            const newListName = formJson.listName;
            const newListComment = formJson.listComment;
            const newList = { name: newListName, status: "active", comment: newListComment } as ShoppingList;

            try {
              fetch("/api/shoppingList", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newList),
              }).then((resp) => {
                resp.json().then((data) => {
                  newList.id = data.data[0];
                  setShoppingLists([...shoppingLists, newList]);
                  setSuccessMessage("New shopping list created successfully");
                  setOpenSnackbar(true);
                });

                handleClose();
              });
            } catch (error) {
              console.error(error);
              setErrorMessage("Error creating new shopping list");
              setOpenSnackbar(true);
              handleClose();
            }
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            <AddShoppingCartOutlinedIcon sx={{ mr: 1, mt: 0.5 }} />
            New Shopping List
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="listName"
            label="List title"
            type="text"
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            id="comment"
            name="listComment"
            label="Comment"
            type="text"
            value={newListComment}
            onChange={(event) => setNewListComment(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit" disabled={!newListName}>
            Save New List
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={{ sx: { width: "100%" } }}>
        <DialogTitle>Delete shopping List</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the shopping list "{listEntryToDelete?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              try {
                fetch(`/api/shoppingList/${listEntryToDelete?.id}`, {
                  method: "DELETE",
                }).then(() => {
                  setShoppingLists(shoppingLists.filter((list) => list.id !== listEntryToDelete?.id));
                  setSuccessMessage("Shopping list deleted successfully");
                  setOpenSnackbar(true);
                  setShowDeleteDialog(false);
                });
              } catch (error) {
                console.error(error);
                setErrorMessage("Error deleting shopping list");
                setOpenSnackbar(true);
                setShowDeleteDialog(false);
              }
            }}
            color="primary"
            variant="contained"
          >
            Delete
          </Button>
          <Button onClick={() => setShowDeleteDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} onClose={closeSnack} autoHideDuration={3000} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <Alert onClose={handleClose} severity={errorMessage ? "error" : "success"} variant="filled" sx={{ width: "100%" }}>
          {errorMessage ? errorMessage : successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShoppingListsPage;
