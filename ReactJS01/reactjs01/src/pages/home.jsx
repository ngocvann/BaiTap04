import { useEffect, useState } from "react";
import { getUserAPI } from "../util/api";

const HomePage = () => {
  const [data, setData] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getUserAPI(); // res giờ LÀ MẢNG vì đã fix axios

      if (Array.isArray(res)) {
        setData(res);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Failed to fetch users:", error);
      setData([]);
    }
  };

  useEffect(() => {
    const init = async () => await fetchUsers();
    init();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>User List</h1>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.email}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
