import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Category, Item } from "../types/shoppingListTypes";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React from "react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const ItemsPage = () => {
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState<string | null>(null);
  const [newItemComment, setNewItemComment] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item>();
  const [categories, setCategories] = useState<Category[]>([]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const filter = createFilterOptions<Category>();
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item>();
  const [filterCategories, setFilterCategories] = useState<Category[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleClose = () => {
    setShowNewItemDialog(false);
    setNewItemName("");
    setNewItemComment("");
    setNewItemPrice(null);
    setSelectedCategories([]);
  };

  const closeSnack = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    try {
      fetch("/api/item?include=itemCategory&pageSize=1000").then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setItems(data.data);
            setAllItems(data.data);
            setLoading(false);
          });
        }
      });

      fetch("/api/category?pageSize=1000").then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setCategories(data.data);
          });
        }
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while fetching items.");
      setOpenSnackbar(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filterCategories.length === 0) {
      setItems(allItems);
    } else {
      setItems(allItems.filter((item) => item.itemCategory?.some((cat) => filterCategories.some((filterCat) => filterCat.id === cat.category.id))));
    }
  }, [allItems, filterCategories]);

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
            <Fab color="primary" aria-label="newItem" variant="extended" sx={{ width: "160px" }} onClick={() => setShowNewItemDialog(true)}>
              <AddCircleOutlineOutlinedIcon />
              <Typography sx={{ ml: 1 }} variant="button">
                Add Item
              </Typography>
            </Fab>
          </Box>
        )}

        {loading ? (
          <Typography variant="h6">Loading items...</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Box
              key="filter"
              sx={{ mt: 3, width: { xs: "100%", sm: "500px" }, display: "flex", bgcolor: "white", justifyContent: "flex-end", p: 1.5, borderRadius: "8px" }}
            >
              <Autocomplete
                multiple
                limitTags={4}
                key="filter-autocomplete"
                options={categories}
                getOptionLabel={(option) => option.name || "All"}
                renderInput={(params) => <TextField {...params} label="Filter on categories" />}
                size="small"
                sx={{ width: { xs: "100%", sm: "500px" } }}
                onChange={(_event, values) => {
                  setFilterCategories(values);
                }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ "& > span": { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
                    <Icon>{option.icon ?? "category e574"}</Icon>
                    {option.name}
                  </Box>
                )}
                value={filterCategories}
              />
            </Box>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                mt: 2,
                display: "flex",
                flexDirection: "column",
                scrollbarWidth: "thin",
                overflowY: "auto",
                height: "calc(100vh - 15rem)",
              }}
            >
              {items.map((itemEntry, i) => (
                <React.Fragment key={itemEntry.id}>
                  <ListItem
                    sx={{
                      p: 0,
                      borderRadius: i === 0 ? "8px 8px 0 0" : i === items.length - 1 ? "0 0 8px 8px" : "0",
                      borderBottom: i === items.length - 1 ? "none" : "1px solid #dbdbdb",
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setItemToDelete(itemEntry);
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
                        setEditingItem(itemEntry);
                        setSelectedCategories(itemEntry.itemCategory?.map((cat) => cat.category) || []);
                        setShowEditItemDialog(true);
                      }}
                      dense
                      sx={{ pl: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <ShoppingBagOutlinedIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "flex-start" }}>
                        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                          {itemEntry.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            overflow: "auto",
                            width: { xs: "100%", md: "100%" },
                            scrollbarWidth: "thin",
                            scrollbarColor: "#e4e4ee #22bcc1",
                          }}
                        >
                          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                            $ {itemEntry.price?.toFixed(2) ?? "0.00"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", overflow: "clip" }}>
                          {itemEntry.itemCategory?.map((cat, i) => {
                            return (
                              <Tooltip key={`tt${i}`} title={cat.category.name}>
                                <Avatar sx={{ height: "32px", width: "32px" }}>
                                  {cat.category.icon ? (
                                    <Icon sx={{ fontSize: "1.4rem" }}>{cat.category.icon}</Icon>
                                  ) : (
                                    <CategoryIcon sx={{ fontSize: "1.4rem" }} />
                                  )}
                                </Avatar>
                              </Tooltip>
                            );
                          })}
                          {!itemEntry.itemCategory && (
                            <Avatar sx={{ height: "32px", width: "32px" }}>
                              <CategoryIcon sx={{ fontSize: "1.4rem" }} />
                            </Avatar>
                          )}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Container>

      <Dialog
        open={showNewItemDialog}
        PaperProps={{
          component: "form",
          sx: { width: "100%" },
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const newItem = {
              name: formJson.itemName as string,
              comment: formJson.itemComment as string,
              price: parseFloat(formJson.itemPrice as string) || undefined,
            } as Item;

            try {
              const response = await fetch("/api/item", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newItem),
              });

              const data = await response.json();
              newItem.id = data.data[0];
              newItem.itemCategory = selectedCategories.map((cat) => ({ category: cat }));

              if (selectedCategories.length > 0) {
                await fetch("/api/itemCategory", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(
                    selectedCategories.map((cat) => ({
                      item: { id: newItem.id },
                      category: { id: cat.id },
                    }))
                  ),
                });
              }

              setItems((prevItems) => [...prevItems, newItem]);
              setSuccessMessage("Item added successfully.");
              setOpenSnackbar(true);
              handleClose();
            } catch (error) {
              setErrorMessage("An error occurred while adding the item.");
              setOpenSnackbar(true);
            }
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            <AddCircleOutlineOutlinedIcon sx={{ mr: 1, mt: 0.5 }} />
            New Item
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="itemName"
            label="Name"
            type="text"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            id="comment"
            name="itemPrice"
            label="Price"
            type="text"
            inputMode="decimal"
            value={newItemPrice || ""}
            onChange={(e) => {
              if (/^(\d)*(\.)?([0-9]*)?$/.test(e.target.value)) {
                setNewItemPrice(e.target.value);
              }
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Autocomplete
            multiple
            id="category-select"
            size="small"
            fullWidth
            handleHomeEndKeys
            options={categories}
            disableCloseOnSelect
            value={selectedCategories}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.inputValue || option.name || ""}
            onChange={async (_event, values) => {
              const newCategories = values.filter((value) => value.inputValue);

              if (newCategories.length > 0) {
                newCategories.forEach((cat) => {
                  cat.name = cat.inputValue;
                  delete cat.inputValue;
                });

                newCategories.forEach((cat) => {
                  cat.id = undefined;
                });

                try {
                  const response = await fetch("/api/category", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCategories),
                  });

                  const data = await response.json();
                  newCategories.forEach((cat, index) => {
                    cat.id = data.data[index];
                  });

                  setCategories((prevCategories) => [...prevCategories, ...newCategories]);
                  setSelectedCategories((prevCategories) => [...prevCategories, ...newCategories]);
                  setSuccessMessage("Category added successfully.");
                  setOpenSnackbar(true);
                } catch (error) {
                  setErrorMessage("An error occurred while adding the category.");
                  setOpenSnackbar(true);
                }
              }

              setSelectedCategories(values);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;

              // Suggest the creation of a new value
              if (inputValue && !options.some((option) => inputValue === option.name)) {
                filtered.push({
                  inputValue,
                  id: inputValue,
                  name: `Add new category "${inputValue}"`,
                });
              }

              return filtered;
            }}
            limitTags={8}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option.name}
              </li>
            )}
            sx={{ mt: 2, mb: 1 }}
            renderInput={(params) => <TextField {...params} label="Categories" InputLabelProps={{ shrink: true }} />}
          />

          <TextField
            margin="normal"
            id="comment"
            name="itemComment"
            label="Comment"
            type="text"
            value={newItemComment}
            onChange={(event) => setNewItemComment(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit" disabled={!newItemName}>
            Save New Item
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showEditItemDialog}
        onClose={() => {
          setShowEditItemDialog(false);
          setEditingItem(undefined);
          setSelectedCategories([]);
        }}
        PaperProps={{ sx: { width: "100%" } }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            <ShoppingBagOutlinedIcon sx={{ mr: 1, mt: 0.5 }} />
            Edit Item
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="itemName"
            label="Name"
            type="text"
            value={editingItem?.name || ""}
            onChange={(event) => setEditingItem({ ...editingItem, name: event.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            id="comment"
            name="itemPrice"
            label="Price"
            type="text"
            inputMode="decimal"
            value={editingItem?.price || ""}
            onChange={(e) => {
              if (/^(\d)*(\.)?([0-9]*)?$/.test(e.target.value)) {
                setEditingItem({ ...editingItem, price: parseFloat(e.target.value) });
              }
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Autocomplete
            multiple
            size="small"
            fullWidth
            handleHomeEndKeys
            options={categories}
            disableCloseOnSelect
            value={selectedCategories}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.inputValue || option.name || ""}
            onChange={async (_event, values) => {
              const newCategories = values.filter((value) => value.inputValue);

              if (newCategories.length > 0) {
                newCategories.forEach((cat) => {
                  cat.name = cat.inputValue;
                  delete cat.inputValue;
                  cat.id = undefined;
                });

                try {
                  const response = await fetch("/api/category", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCategories),
                  });

                  const data = await response.json();
                  newCategories.forEach((cat, index) => {
                    cat.id = data.data[index];
                  });

                  setCategories((prevCategories) => [...prevCategories, ...newCategories]);
                  setSelectedCategories((prevSelected) => [...prevSelected, ...newCategories]);
                  setSuccessMessage("Category added successfully.");
                  setOpenSnackbar(true);
                } catch (error) {
                  setErrorMessage("An error occurred while adding the category.");
                  setOpenSnackbar(true);
                }
              } else {
                setSelectedCategories(values);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;

              // Suggest the creation of a new value
              if (inputValue && !options.some((option) => inputValue === option.name)) {
                filtered.push({
                  inputValue,
                  name: `Add new category "${inputValue}"`,
                });
              }

              return filtered;
            }}
            limitTags={8}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option.name}
              </li>
            )}
            sx={{ mt: 2, mb: 1 }}
            renderInput={(params) => <TextField {...params} label="Categories" InputLabelProps={{ shrink: true }} />}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const localEditingItem = {
                ...editingItem,
                "itemCategory.item": selectedCategories.map((cat) => ({ category: { id: cat.id } })),
                itemCategory: selectedCategories.map((cat) => ({ category: cat })),
              };

              try {
                await fetch(`/api/item/${editingItem?.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(localEditingItem),
                });

                setItems((prevItems) => prevItems.map((item) => (item.id === editingItem?.id ? localEditingItem : item)));
                setShowEditItemDialog(false);
                setEditingItem(undefined);
                setSelectedCategories([]);
                setSuccessMessage("Item updated successfully.");
                setOpenSnackbar(true);
              } catch (error) {
                // Handle error (e.g., display an error message)
                setErrorMessage("An error occurred while updating the item.");
                setOpenSnackbar(true);
              }
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setShowEditItemDialog(false);
              setEditingItem(undefined);
              setSelectedCategories([]);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={{ sx: { width: "100%" } }}>
        <DialogTitle>Delete item</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the item "{itemToDelete?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              fetch(`/api/item/${itemToDelete?.id}`, {
                method: "DELETE",
              }).then(() => {
                setItems(items.filter((list) => list.id !== itemToDelete?.id));
                setShowDeleteDialog(false);
                setItemToDelete(undefined);
                setSuccessMessage("Item deleted successfully.");
                setOpenSnackbar(true);
              })
              .catch(() => {
                setErrorMessage("An error occurred while deleting the item.");
                setOpenSnackbar(true);
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

export default ItemsPage;
