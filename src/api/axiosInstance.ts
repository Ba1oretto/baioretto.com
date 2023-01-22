import axios from "axios";

const baseURL = "https://swapi.dev/api/";

export default axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});