// import { Button } from "@mantine/core";
import '@mantine/core/styles.css';

import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
function App() {
  return (
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold">
    //     Hello, Vite + React + TypeScript + Mantine + Tailwind!
    //   </h1>
    //   <Button className="mt-4">Mantine Button</Button>
    // </div>
    <RouterProvider router={router} />
  );
}

export default App;
