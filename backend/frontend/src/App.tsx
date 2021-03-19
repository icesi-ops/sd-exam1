import React, { Component } from "react";
import "./App.css";
import { FileSelector } from "./components/upload";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import classes from "*.module.css";

declare global {
  interface Window {
    HOST: string;
    LB: StringConstructor;
  }
}

interface File {
  id: string;
  name: string;
  path: string;
  type: string;
}

export default class App extends Component<any, {
  files:  [File] | [],
  storage: string,
  loading: boolean,
}> {
  host = window.HOST || "test";

  handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loading: true });
    const files = event.target.files;
    const formData = new FormData();
    if (files == null) {
      return await this.update();
    }
    formData.append("myFile", files[0]);

    const r = await (
      await fetch("http://" + window.LB + "/api/upload", {
        method: "POST",
        body: formData,
      })
    ).json();
    console.log(r);
    await this.update();
  };

  update = async () => {
    const files: [File] = await (await fetch("http://" + window.LB + "/api/files")).json();
    const storage: string = await (
      await fetch("http://" + window.LB + "/api/availableStorage")
    ).json();
    this.setState({
      files,
      storage,
      loading: false,
    });
  };

  constructor(props: any) {
    super(props);
    this.state = {
      files: [],
      storage: "",
      loading: false,
    };
  }

  componentDidMount = async () => {
    await this.update();
  };

  render() {
    return (
      <div>
        <div style={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit">
                Files - {this.host} is glad to host you - avaible storage ={" "}
                {this.state.storage}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div style={{ paddingLeft: "1em" }}>
          <div>
            <h2>Add a new file or update older file</h2>
          </div>
          <p>
            Please choose the files which you would like to upload to our
            database
          </p>
          {!this.state.loading ? (
            <div>
              <input
                style={{ display: "none" }}
                id="contained-button-file"
                type="file"
                onChange={this.handleFile}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
            </div>
          ) : (
            <CircularProgress />
          )}
        </div>
        <TableContainer component={Paper}>
          <Table
            style={{ minWidth: 650 }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.files.map((row: File) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row"> {row.id} </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.path}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
