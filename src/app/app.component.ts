import { Component, OnInit } from "@angular/core";
import { NodeService } from "./nodeservice";
import { TreeNode } from "primeng/api";
import { PrimeNGConfig } from "primeng/api";

import Tabulator from "tabulator-tables";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  files: TreeNode[];

  frozenCols: any[];
  cols: any[];

  columns: any[];
  rowsNumber: number = 2;
  table: Tabulator;

  childrenCount = 1;
  rowsSize = 1;
  columnsSize = 1;
  columnLevel = 3;
  columnChldrenCount = 10;
  loading = false;

  constructor(
    private nodeService: NodeService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    // const childrenCount = 20;
    // const rowsSize = 10;
    // const columnsSize = 10;

    this.files = [];
    for (let i = 0; i < this.rowsSize; i++) {
      let node = {
        data: {
          name: "Item " + i,
          type: "Type " + i
        },
        expanded: true,
        children: []
      };

      // for (let xx: number = 0; xx < this.columnsSize; xx++) {
      //   node.data["size" + xx] = Math.floor(Math.random() * 1000) + 1 + "kb";
      // }

      for (let j = 0; j < this.childrenCount; j++) {
        const ch = {
          data: {
            id: i + "_" + j,
            name: "Item " + j + " - 0",
            type: "Type " + i
          }
        };

        for (let cc: number = 0; cc < this.columnChldrenCount; cc++) {
          ch.data[`size_${this.columnLevel}_${cc}`] =
            Math.floor(Math.random() * 1000) + 1 + "kb";
        }

        node.children.push(ch);
      }

      this.files.push(node);

      this.rowsNumber = Math.floor(20 / this.childrenCount);
      if (this.rowsNumber === 0) {
        this.rowsNumber = 1;
      }
    }

    // this.cols = [];
    this.columns = [];
    this.columns.push({ field: "data.name", title: "Name", frozen: false });
    this.columns.push({ field: "data.type", title: "Type" });
    // this.cols.push({ field: 'data.name', header: 'Name' });
    // this.cols.push({ field: "data.type", header: "Type" });
    let columns = this.getColumns(this.columnsSize);
    this.fillChildren(columns, this.columnLevel);
    this.columns = this.columns.concat(columns);
    this.frozenCols = [{ field: "name", header: "Name" }];

    // this.primengConfig.ripple = true;
  }

  clear() {
    this.table = {};
  }

  displayTable() {
    // this.loading = true;
    // this.table.setData(this.files);
    this.table = new Tabulator("#tabulatorId", {
      data: this.files,
      virtualDomHoz: true,
      columns: this.columns,
      // layout: 'fitData',
      maxHeight: 400,
      index: 'data.id',
      autoResize: true,
      dataTree: true,
      dataTreeChildField: "children",
      dataTreeStartExpanded: true,
      // tableBuilding: () => (this.loading = true),
      // tableBuilt: () => (this.loading = false),
      // virtualDomBuffer: 400
    });
  }

  getColumns(index: number, level: number = 0): any[] {
    const columns = [];
    for (let cin: number = 0; cin < index; cin++) {
      columns.push({
        field: `data.size_${level}_${cin}`,
        title: `Size_${level}_${cin}`
      });
    }
    return columns;
  }

  fillChildren(columns: any[], index: number, count: number = 5) {
    if (index > 0) {
      const children = this.getColumns(count, this.columnLevel - index + 1);
      for (let i = 0; i < columns.length; i++) {
        columns[i].columns = children;
        this.fillChildren(
          columns[i].columns,
          index - 1,
          this.columnChldrenCount
        );
      }
    }
  }

  getColumnsSize(): number {
    return (
      5 *
      this.columnsSize *
      Math.pow(this.columnChldrenCount, this.columnLevel - 1)
    );
  }
}
