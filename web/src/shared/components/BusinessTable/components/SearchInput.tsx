import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTableState } from "../hooks";
import { searchActions } from "../state/actions";
import { useState, useEffect, useRef } from "react";

export function SearchInput() {
  const { state, dispatch } = useTableState();
  const [localValue, setLocalValue] = useState(state.searchKeyword);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdateRef = useRef(false);

  // Sync localValue with state.searchKeyword only when it changes externally
  // (not from our own debounced dispatch)
  useEffect(() => {
    // Skip sync if this is our own update
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    // Only sync if state changed and it's different from local value
    if (state.searchKeyword !== localValue) {
      setLocalValue(state.searchKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searchKeyword]);

  // Debounce the search dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mark this as an internal update to prevent sync loop
      isInternalUpdateRef.current = true;

      // Check if input is currently focused before dispatching
      const wasFocused = document.activeElement === inputRef.current;

      dispatch(searchActions.set(localValue));

      // Restore focus after dispatch if it was focused before
      // Use setTimeout to ensure it happens after all re-renders
      if (wasFocused && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <TextField
      inputRef={inputRef}
      size='small'
      placeholder='Search products...'
      value={localValue}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon fontSize='small' />
          </InputAdornment>
        ),
      }}
      sx={{
        minWidth: 250,
        maxWidth: 350,
        width: "100%",
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  );
}
