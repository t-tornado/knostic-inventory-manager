import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTableState } from "../hooks";
import { searchActions } from "../state/actions";
import { useState, useEffect } from "react";

export function SearchInput() {
  const { state, dispatch } = useTableState();
  const [localValue, setLocalValue] = useState(state.searchKeyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchActions.set(localValue));
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <TextField
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
