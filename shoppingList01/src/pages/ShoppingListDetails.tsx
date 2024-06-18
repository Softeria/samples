import { useEffect, useState } from "react";
import { Category, Item, ShoppingList, ShoppingListItem, shoppingListItemWithCategory } from "../types/shoppingListTypes";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  Snackbar,
  Autocomplete,
  createFilterOptions,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Icon,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Edit } from "@mui/icons-material";

const ShoppingListDetails = () => {
  const [shoppinglistItems, setShoppinglistItems] = useState<shoppingListItemWithCategory[]>();
  const [shoppingList, setShoppingList] = useState<ShoppingList>();
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem>();
  const [quantity, setQuantity] = useState<number>(1);
  const filter = createFilterOptions<Item>();
  const [showQuantityChangeDialog, setShowQuantityChangeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string>();
  const [deleteItemName, setDeleteItemName] = useState<string>();
  const [filterCategories, setFilterCategories] = useState<Category[]>([]);
  const params = useParams();

  const closeSnack = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    try {
      fetch(`/api/shoppingList/${params.shoppingListId}`).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setShoppingList(data.data[0]);
          });
        }
      });

      fetch(`/api/shoppingListItemsWithCategory?filter=listId eq "${params.shoppingListId}"`).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            data.data.forEach((item: shoppingListItemWithCategory) => {
              item.categoryId = item.categoryId || "-1";
            });
            setShoppinglistItems(data.data);
          });
        }
      });

      fetch("/api/item?include=itemCategory&pageSize=1000").then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setAllItems(data.data as Item[]);
          });
        }
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Error loading shopping list");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, [params.shoppingListId]);

  const addItemToList = () => {
    if (selectedItem) {
      const bodyData = {
        item: { id: selectedItem.item.id },
        shoppingList: { id: params.shoppingListId },
        quantity: quantity || 1,
        isPurchased: false,
      };

      fetch("/api/shoppingListItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      })
        .then((response) => {
          if (!response.ok) {
            setErrorMessage("Error adding item to shopping list");
            setOpenSnackbar(true);
            return;
          }

          return response.json();
        })
        .then((resp) => {
          if (!resp) return;

          const newShoppingListItem = {
            listId: params.shoppingListId,
            shoppingListItemId: resp.data[0],
            itemId: selectedItem.id,
            categoryName: selectedItem.item.itemCategory?.[0].category.name,
            itemName: selectedItem.item.name,
            itemPrice: selectedItem.item.price,
            isPurchased: false,
            quantity: quantity || 1,
            categoryId: selectedItem.item.itemCategory?.[0].category.id?.toLowerCase(),
            icon: selectedItem.item.itemCategory?.[0].category.icon,
          };

          setShoppinglistItems([...(shoppinglistItems || []), newShoppingListItem]);
          setSelectedItem(undefined);
          setQuantity(1);
          setSuccessMessage("Item added to shopping list");
          setOpenSnackbar(true);
          setShowAddItemDialog(false);
        })
        .catch(() => {
          setErrorMessage("Error adding item to shopping list");
          setOpenSnackbar(true);
        });
    }
  };

  const getTotalItemsInList = () => {
    return shoppinglistItems?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) || 0;
  };

  const getNumberOfItemsRemaining = () => {
    return shoppinglistItems?.filter((item) => !item.isPurchased).reduce((acc, item) => acc + (item.quantity ?? 0), 0) || 0;
  };

  const getTotalListCost = () => {
    return shoppinglistItems?.reduce((acc, item) => acc + (item.itemPrice || 0) * (item.quantity ?? 0), 0) || 0;
  };

  const getAllCategories = (items: shoppingListItemWithCategory[]): Category[] => {
    const categories: Category[] = [];
    items.forEach((item) => {
      if (!categories.some((c) => c.id?.toLowerCase() === item.categoryId?.toLowerCase())) {
        categories.push({ id: item.categoryId?.toLowerCase(), name: item.categoryName || "No category", icon: item.icon || "category e574" });
      }
    });

    return categories;
  };

  const getAllOrSelectedCategories = () => {
    if (filterCategories.length === 0) {
      return getAllCategories(shoppinglistItems || []);
    } else {
      return filterCategories;
    }
  };

  const saveShoppingList = (shoppingList: ShoppingList | undefined) => {
    if (shoppingList) {
      fetch(`/api/shoppingList/${shoppingList.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shoppingList),
      })
        .then((response) => {
          if (response.ok) {
            setSuccessMessage("Shopping list updated successfully");
            setOpenSnackbar(true);
          }
        })
        .catch(() => {
          setErrorMessage("Error updating shopping list");
          setOpenSnackbar(true);
        });
    }
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
        {loading ? (
          <Typography variant="h6">Loading shopping list...</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "flex-start", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography variant="h6">{shoppingList?.name}</Typography>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => {
                  setShowEditDialog(true);
                }}
              >
                <Edit />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">{shoppingList?.comment}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", mt: 1 }}>
              <Fab
                color="primary"
                aria-label="newShoppingList"
                variant="extended"
                sx={{ width: "160px" }}
                onClick={() => {
                  setShowAddItemDialog(true);
                }}
              >
                <AddShoppingCartOutlinedIcon />
                <Typography sx={{ ml: 1 }} variant="button">
                  Add Item
                </Typography>
              </Fab>
            </Box>
            <Typography variant="caption" sx={{ mt: 1, mb: 0, pb: 0 }}>{`Total number of items (quantity): ${getTotalItemsInList()}`}</Typography>
            <Typography variant="caption" sx={{ mt: 0, pt: 0 }}>{`Items remaining: ${getNumberOfItemsRemaining()}`}</Typography>
            <Typography variant="caption" sx={{ mt: 0, pt: 0 }}>{`Total cost: $ ${getTotalListCost()}`}</Typography>
            <Box
              key="filter"
              sx={{ mt: 1, width: { xs: "100%", sm: "500px" }, display: "flex", bgcolor: "white", justifyContent: "flex-end", p: 1.5, borderRadius: "8px" }}
            >
              <Autocomplete
                multiple
                limitTags={4}
                key="filter-autocomplete"
                options={getAllCategories(shoppinglistItems || [])}
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
                display: "flex",
                flexDirection: "column",
                scrollbarWidth: "thin",
                overflowY: "auto",
                height: "calc(100vh - 25rem)",
              }}
            >
              {getAllOrSelectedCategories().map((category, i) => {
                return (
                  <Box key={i} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, alignItems: "center" }}>
                      <Icon fontSize="small">{category.icon ?? "category e574"}</Icon>
                      <Typography variant="h6">{category.name}</Typography>
                    </Box>
                    <List sx={{ width: "100%" }}>
                      {shoppinglistItems
                        ?.filter((item) => item.categoryId?.toLowerCase() === category.id?.toLowerCase())
                        .map((item, i) => {
                          return (
                            <ListItem
                              key={item.itemId + i.toString()}
                              sx={{
                                p: 0,
                                borderRadius: i === 0 ? "8px 8px 0 0" : i === (shoppinglistItems?.length || 0) - 1 ? "0 0 8px 8px" : "0",
                                borderBottom: i === (shoppinglistItems?.length || 0) - 1 ? "none" : "1px solid #dbdbdb",
                              }}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => {
                                    setDeleteItemId(item.shoppingListItemId);
                                    setDeleteItemName(item.itemName);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              }
                            >
                              <ListItemButton role={undefined} dense>
                                <ListItemAvatar>
                                  <Avatar>
                                    <ShoppingCartIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={item.isPurchased}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const isChecked = e.target.checked;
                                      fetch(`/api/shoppingListItem/${item.shoppingListItemId}`, {
                                        method: "PATCH",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          isPurchased: isChecked,
                                        }),
                                      }).then((response) => {
                                        if (response.ok) {
                                          setShoppinglistItems(
                                            (shoppinglistItems || []).map((it) => {
                                              if (it.shoppingListItemId === item.shoppingListItemId) {
                                                return { ...it, isPurchased: isChecked };
                                              }
                                              return it;
                                            })
                                          );
                                          setSuccessMessage("Item updated");
                                          setOpenSnackbar(true);
                                        } else {
                                          setErrorMessage("Error updating item");
                                          setOpenSnackbar(true);
                                        }
                                      });
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  onClick={() => {
                                    setSelectedItem({
                                      id: item.shoppingListItemId,
                                      item: { id: item.itemId, name: item.itemName },
                                      isPurchased: item.isPurchased ?? false,
                                      quantity: item.quantity ?? 0,
                                    });
                                    setQuantity(item.quantity || 1);
                                    setShowQuantityChangeDialog(true);
                                  }}
                                  primary={item.itemName}
                                  secondary={<>{`$${item.itemPrice || " - "} | ${item.quantity} ${(item.quantity || 0) > 1 ? "items" : "item"}`}</>}
                                  sx={{ height: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                    </List>
                  </Box>
                );
              })}
            </List>
          </Box>
        )}
      </Container>

      <Dialog fullWidth open={showEditDialog} onClose={() => setShowEditDialog(false)}>
        <DialogTitle>Edit Shopping List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={shoppingList?.name}
            onChange={(e) => {
              setShoppingList({ ...shoppingList, name: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            value={shoppingList?.comment}
            onChange={(e) => {
              setShoppingList({ ...shoppingList, comment: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setQuantity(1);
              setShowEditDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              saveShoppingList(shoppingList);
              setShowEditDialog(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth open={showAddItemDialog} onClose={() => setShowAddItemDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            <AddShoppingCartOutlinedIcon sx={{ mr: 1, mt: 0.5 }} />
            Add Item
          </Box>
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            value={selectedItem?.item || { name: "" }}
            size="small"
            onChange={(_event, newValue) => {
              if (typeof newValue === "string") {
                setSelectedItem({
                  id: undefined,
                  item: { id: undefined, name: newValue },
                  shoppingList: { id: params.shoppingListId },
                  isPurchased: false,
                  quantity: 1,
                });
              } else if (newValue?.inputValue) {
                // Create a new value from the user input
                fetch("/api/item", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name: newValue.inputValue }),
                })
                  .then((response) => (response.ok ? response.json() : Promise.reject()))
                  .then((data) => {
                    const newItem = data.data[0];
                    setAllItems((prevItems) => [...prevItems, newItem]);
                    setSelectedItem({
                      id: newItem,
                      item: { id: newItem, name: newValue.inputValue },
                      isPurchased: false,
                      quantity: 1,
                    });
                  })
                  .catch(() => {
                    setErrorMessage("Error adding item");
                    setOpenSnackbar(true);
                  });
              } else {
                setSelectedItem((prevSelectedItem) => ({
                  ...prevSelectedItem,
                  item: newValue!,
                  isPurchased: false,
                  quantity: 1,
                }));
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                });
              }
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="add-item-autocomplete"
            options={allItems.filter((item) => !shoppinglistItems?.some((it) => it.itemId?.toLowerCase() === item.id?.toLowerCase()))}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              if (option.inputValue) return option.inputValue;
              return option.name || "";
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.name}>
                {option.name}
              </li>
            )}
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            renderInput={(params) => <TextField {...params} label="Choose item" InputLabelProps={{ shrink: true }} />}
          />

          <TextField
            size="small"
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            value={quantity ?? 1}
            onChange={(e) => {
              setQuantity(parseInt(e.target.value));
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => setShowAddItemDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" disabled={!selectedItem} onClick={() => addItemToList()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth open={showQuantityChangeDialog} onClose={() => setShowQuantityChangeDialog(false)}>
        <DialogTitle>Change Quantity</DialogTitle>
        <DialogContent>
          <Typography>{`Specify quantity for ${selectedItem?.item.name}`}</Typography>
          <TextField
            size="small"
            margin="dense"
            id="quantity"
            label=""
            type="number"
            value={quantity ?? 1}
            onChange={(e) => {
              setQuantity(parseInt(e.target.value));
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setQuantity(1);
              setSelectedItem(undefined);
              setShowQuantityChangeDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const response = await fetch(`/api/shoppingListItem/${selectedItem?.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ quantity }),
                });

                if (response.ok) {
                  setShoppinglistItems((shoppinglistItems || []).map((item) => (item.shoppingListItemId === selectedItem?.id ? { ...item, quantity } : item)));
                  setSuccessMessage("Quantity updated");
                } else {
                  setErrorMessage("Error updating quantity");
                }
              } catch (error) {
                setErrorMessage("Error updating quantity");
              } finally {
                setOpenSnackbar(true);
                setShowQuantityChangeDialog(false);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={{ sx: { width: "100%" } }}>
        <DialogTitle>Delete item</DialogTitle>
        <DialogContent>
          <Typography>{`Remove ${deleteItemName} from list?`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              try {
                const response = await fetch(`/api/shoppingListItem/${deleteItemId}`, {
                  method: "DELETE",
                });

                if (response.ok) {
                  setShoppinglistItems((shoppinglistItems || []).filter((item) => item.shoppingListItemId !== deleteItemId));
                  setSuccessMessage(`${deleteItemName} removed from shopping list`);
                } else {
                  setErrorMessage("Error removing item from shopping list");
                }
              } catch (error) {
                setErrorMessage("Error removing item from shopping list");
              } finally {
                setOpenSnackbar(true);
                setShowDeleteDialog(false);
                setDeleteItemId(undefined);
                setDeleteItemName(undefined);
              }
            }}
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

export default ShoppingListDetails;
