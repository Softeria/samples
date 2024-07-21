import { useEffect, useState } from "react";
import { Category } from "../types/shoppingListTypes";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import { convertMuiIconsTextToJson } from "../utils/functions";
import MuiIcons from "../assets/muiIcons";
import Icon from "@mui/material/Icon";

const CategoriesPage = () => {
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category>();
  const icons = convertMuiIconsTextToJson(MuiIcons);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category>();
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);

  const handleClose = () => {
    setShowNewCategoryDialog(false);
    setNewCategoryName("");
    setNewCategoryIcon("");
  };

  useEffect(() => {
    try {
      fetch("/api/category?pageSize=1000").then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setCategories(data.data);
            setLoading(false);
          });
        }

        if (response.status === 403) {
          console.error("Unauthorized");
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  const closeSnack = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
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
            <Fab color="primary" aria-label="newCategory" variant="extended" sx={{ width: "200px" }} onClick={() => setShowNewCategoryDialog(true)}>
              +<CategoryIcon />
              <Typography sx={{ ml: 1 }} variant="button">
                Add Category
              </Typography>
            </Fab>
          </Box>
        )}

        {loading ? (
          <Typography variant="h6">Loading categories...</Typography>
        ) : categories.length === 0 ? (
          <Typography variant="h6" sx={{ mt: 2 }}>
            No categories found.
          </Typography>
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
              height: { xs: "calc(100vh - 10rem)", sm: "calc(100vh - 9rem)" },
            }}
          >
            {categories.map((cat, i) => (
              <React.Fragment key={cat.name}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  sx={{
                    p: 0,
                    pl: 0,
                    borderRadius: i === 0 ? "8px 8px 0 0" : i === categories.length - 1 ? "0 0 8px 8px" : "0",
                  }}
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowEditCategoryDialog(true);
                    }}
                    dense
                  >
                    <ListItemAvatar>
                      <Avatar>{cat.icon ? <Icon>{cat.icon}</Icon> : <CategoryIcon />}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={cat.name} sx={{ height: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }} />
                  </ListItemButton>
                </ListItem>
                {i < categories.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Container>
      <Dialog
        open={showNewCategoryDialog}
        PaperProps={{
          component: "form",
          sx: { width: "100%" },
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const newCatName = formJson.catName as string;
            const newCat = { name: newCatName, icon: newCategoryIcon } as Category;

            try {
              const response = await fetch("/api/category", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newCat),
              });

              const data = await response.json();
              setSuccessMessage("Category added successfully.");
              setOpenSnackbar(true);
              newCat.id = data.data[0];
              setCategories([...categories, newCat]);
            } catch (error) {
              setErrorMessage("Could not add category.");
              setOpenSnackbar(true);
            } finally {
              handleClose();
            }
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            +<CategoryOutlinedIcon sx={{ mr: 1, mt: 0.5 }} />
            New Category
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="catName"
            label="Category name"
            type="text"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Autocomplete
            id="catIcon"
            fullWidth
            size="small"
            options={icons}
            sx={{ mt: 2 }}
            autoHighlight
            isOptionEqualToValue={(option, value) => option.code === value.code}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" sx={{ "& > span": { mr: 2, flexShrink: 0 } }} {...props} key={option.code}>
                <Icon>{option.code}</Icon>
                {option.label}
              </Box>
            )}
            onChange={(_event, value) => {
              if (value) {
                setNewCategoryIcon(value.code);
              }
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Category icon"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Icon>{newCategoryIcon}</Icon>
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              );
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit" disabled={!newCategoryName}>
            Save New Category
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditCategoryDialog} onClose={() => setShowEditCategoryDialog(false)} PaperProps={{ sx: { width: "100%" } }}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            <CategoryOutlinedIcon sx={{ mr: 1, mt: 0.5 }} />
            Edit Category
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="catName"
            label="Category name"
            type="text"
            value={editingCategory?.name}
            onChange={(event) => setEditingCategory({ ...editingCategory, name: event.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Autocomplete
            id="catIcon"
            fullWidth
            size="small"
            options={icons}
            sx={{ mt: 2 }}
            autoHighlight
            isOptionEqualToValue={(option, value) => option.code === value.code}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" sx={{ "& > span": { mr: 2, flexShrink: 0 } }} {...props} key={option.code}>
                <Icon>{option.code}</Icon>
                {option.label}
              </Box>
            )}
            onChange={(_event, value) => {
              if (value) {
                setEditingCategory({ ...editingCategory, icon: value.code });
              }
            }}
            value={icons.find((icon) => icon.code === editingCategory?.icon)}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Category icon"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Icon>{editingCategory?.icon}</Icon>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              );
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              fetch(`/api/category/${editingCategory?.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editingCategory),
              }).then((resp) => {
                if (!resp.ok) {
                  setErrorMessage("Could not update category.");
                  setOpenSnackbar(true);
                  return;
                } else {
                  setSuccessMessage("Category updated successfully.");
                  setOpenSnackbar(true);
                  setCategories(categories.map((cat) => (cat.id === editingCategory?.id ? editingCategory! : cat)));
                  setShowEditCategoryDialog(false);
                }
              });
            }}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
          <Button onClick={() => setShowEditCategoryDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={{ sx: { width: "100%" } }}>
        <DialogTitle>Delete category</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the category "{categoryToDelete?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              fetch(`/api/category/${categoryToDelete?.id}`, {
                method: "DELETE",
              }).then((resp) => {
                if (!resp.ok) {
                  setErrorMessage("Could not delete category. If there are items in this category, please remove them first.");
                  setOpenSnackbar(true);
                  return;
                } else {
                  setSuccessMessage("Category deleted successfully.");
                  setOpenSnackbar(true);
                  setCategories(categories.filter((cat) => cat.id !== categoryToDelete?.id));
                  setShowDeleteDialog(false);
                }
              });
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

export default CategoriesPage;
