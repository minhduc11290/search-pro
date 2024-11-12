// import { Button } from "@mantine/core";
import '@mantine/core/styles.css';

import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import { ModalsProvider } from '@mantine/modals';
function App() {
  return (
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold">
    //     Hello, Vite + React + TypeScript + Mantine + Tailwind!
    //   </h1>
    //   <Button className="mt-4">Mantine Button</Button>
    // </div>
    <ModalsProvider>
      <RouterProvider router={router} />
    </ModalsProvider>
  );
}

export default App;
