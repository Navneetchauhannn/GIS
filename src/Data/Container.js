import axios from 'axios';

const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:5000/getContainers");
    return res.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default fetchData;
