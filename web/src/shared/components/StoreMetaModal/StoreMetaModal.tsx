import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Store, StoreId } from "@/core/models/store/model";
import {
  storePayloadSchema,
  type StorePayload,
} from "@/features/store/validation";
import { formatDateTime } from "@/shared/utils/format";
import { createInitialState } from "./createInitialState";
import { StoreMetaModalFormState } from "./types";

export type StoreMetaModalMode = "create" | "edit";

interface StoreMetaModalProps {
  open: boolean;
  mode: StoreMetaModalMode;
  store: Store | null;
  onClose: () => void;
  onCreate?: (data: StorePayload) => void;
  onUpdate?: (store: Store) => void;
  onDelete?: (storeId: StoreId) => void;
}

export function StoreMetaModal({
  open,
  mode,
  store,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: StoreMetaModalProps) {
  const [formState, setFormState] = useState<StoreMetaModalFormState>(() =>
    createInitialState(store)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormState(createInitialState(store));
    setErrors({});
  }, [store]);

  const handleChange =
    (field: keyof StoreMetaModalFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const validate = (): boolean => {
    const payload: StorePayload = {
      name: formState.name.trim(),
    };

    const result = storePayloadSchema.safeParse(payload);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleCreate = () => {
    if (!validate() || !onCreate) return;

    const payload: StorePayload = {
      name: formState.name.trim(),
    };

    onCreate(payload);
  };

  const handleUpdate = () => {
    if (!validate() || !store || !onUpdate) return;

    const updatedStore: Store = {
      ...store,
      name: formState.name.trim(),
    };

    onUpdate(updatedStore);
  };

  const handleSave = () => {
    if (mode === "create") {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  const handleDelete = () => {
    if (!store || !onDelete) return;
    onDelete(store.id);
  };

  const title = mode === "create" ? "Create Store" : "Edit Store";
  const saveButtonText = mode === "create" ? "Create Store" : "Save Changes";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='store-meta-dialog-title'
    >
      <DialogTitle id='store-meta-dialog-title'>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label='Store Name'
            value={formState.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
          {store && (
            <Box
              sx={{
                pt: 1,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  fontSize: "0.875rem",
                  color: "text.secondary",
                }}
              >
                Last updated: {formatDateTime(store.updatedAt)}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        {mode === "edit" && onDelete && (
          <Button color='error' variant='outlined' onClick={handleDelete}>
            Delete Store
          </Button>
        )}
        {mode === "create" && <Box />}
        <DialogActions sx={{ p: 0 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant='contained'>
            {saveButtonText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
