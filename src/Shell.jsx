import React, { Suspense } from "react";
import { BrowserRouter, NavLink, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { red, blue } from "@mui/material/colors";
import Button from "@mui/material/Button";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
      alt: blue[500],
    },
  },
});

import useAppStore from "./StateService";
import "./index.css";

import { Show } from "show/Show";
import { Search } from "search/Search";
import { Video } from "video/Video";
const Live = React.lazy(() => import("live/Live"));
const Landing = React.lazy(() => import("landing/Landing"));
const Nav = () => (
  <ul>
    <li>
      <NavLink to="/">Home</NavLink>
    </li>
    <li>
      <NavLink to="search">Search</NavLink>
    </li>
    <li>
      <NavLink to="video">Video</NavLink>
    </li>
    <li>
      <NavLink to="live">Live</NavLink>
    </li>
  </ul>
);

const ButtonComponent = () => {
  const theme = useTheme();
  console.log("Button theme", theme);
  return <Button variant="contained">Hello World</Button>;
};
const Shell = () => {
  const state = useAppStore((state) => state);
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <h1>Host App: Rendering {state.micro} micro front-end</h1>
          <Nav />
          <ButtonComponent />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="show/:id" element={<Show />} />
              <Route path="search" element={<Search />} />
              <Route path="video" element={<Video />} />
              <Route path="live" element={<Live />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default Shell;

// const root = createRoot(document.getElementById("app"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
