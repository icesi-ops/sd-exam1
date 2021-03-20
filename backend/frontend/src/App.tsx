import React, { Component } from "react";
import "./App.css";

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

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(a: number, b = 2) {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
}

export default class App extends Component<
  any,
  {
    files: [File] | [];
    storage: string;
    loading: boolean;
  }
> {
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
      await fetch("https://" + window.LB + "/api/upload", {
        method: "POST",
        body: formData,
      })
    ).json();
    console.log(r);
    await this.update();
  };

  update = async () => {
    const files: [File] = await (
      await fetch("https://" + window.LB + "/api/files")
    ).json();
    const storage: string = await (
      await fetch("https://" + window.LB + "/api/availableStorage")
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
              <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                Files - {this.host} is glad to host you
              </Typography>
              <Typography variant="h6" color="inherit">
                Avaible storage = {formatBytes(Number.parseInt(this.state.storage) * 1024)}
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
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.files.map((row: File) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {" "}
                    {row.name}{" "}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.path}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
