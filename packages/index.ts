
import express from "express"

const port=3999
const app = express()
app.use(express.json());

app.listen(port, () => {
  console.log(`Auth Server is running on port: ${port}`);
});


console.log("zzzz")