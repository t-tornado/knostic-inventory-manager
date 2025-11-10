import { Button, Typography } from "@mui/material";
import { z } from "zod";
import { toast } from "react-toastify";

function App() {
  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  });

  const handleValidate = () => {
    const result = schema.safeParse({ name: "", email: "john@example.com" });
    if (!result.success) {
      console.log(result.error);
      toast.error(result.error.message);
    } else {
      toast.success("Validation successful");
      console.log(result.data);
    }
  };

  return (
    <div>
      <Typography variant='h1'>Knostic Inventory Management</Typography>
      <Button variant='contained' color='primary' onClick={handleValidate}>
        Validate
      </Button>
    </div>
  );
}

export default App;
