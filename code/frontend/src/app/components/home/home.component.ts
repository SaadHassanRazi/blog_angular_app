import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { BlogService, Post } from '../../core/services/blog.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AgGridModule, ButtonModule, PaginatorModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div
            class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-5"
          >
            <h1 class="text-900 text-3xl font-medium m-0">Blog Posts</h1>
            <button
              *ngIf="isAuthenticated"
              pButton
              pRipple
              label="Create Post"
              icon="pi pi-plus"
              class="p-button-success mt-3 md:mt-0"
              (click)="onCreatePost()"
            ></button>
          </div>

          <ag-grid-angular
            style="width: 100%; height: 500px;"
            class="ag-theme-alpine"
            [rowData]="rowData"
            [columnDefs]="columnDefs"
            [defaultColDef]="defaultColDef"
            [rowClassRules]="rowClassRules"
            [pagination]="false"
            [rowSelection]="'single'"
            (gridReady)="onGridReady($event)"
            (rowClicked)="onRowClicked($event)"
          >
          </ag-grid-angular>

          <p-paginator
            [rows]="5"
            [totalRecords]="totalRecords"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            [rowsPerPageOptions]="[5]"
          ></p-paginator>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  rowData: Post[] = [];
  totalRecords: number = 0;
  isAuthenticated: boolean = false;
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
    },
    {
      field: 'content',
      headerName: 'Excerpt',
      flex: 3,
      valueFormatter: (params: ValueFormatterParams) => {
        const content = params.value as string;
        return content.length > 150
          ? content.substring(0, 150) + '...'
          : content;
      },
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: 'author.email',
      headerName: 'Author',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Published Date',
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    suppressMovable: true,
  };

  rowClassRules = {
    'ag-row-odd': (params: any) => params.node.rowIndex % 2 !== 0,
  };

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  loadPosts(page: number): void {
    this.blogService.getPosts(page).subscribe((response) => {
      this.rowData = response.posts;
      this.totalRecords = response.totalPosts;
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit();
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    const page = event.page ? event.page + 1 : 1;
    this.loadPosts(page);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.loadPosts(1);
  }

  onRowClicked(event: RowClickedEvent): void {
    this.router.navigate(['/post', event.data.id]);
  }

  onCreatePost(): void {
    this.router.navigate(['/post/create']);
  }
} 