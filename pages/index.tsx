/* eslint-disable @next/next/no-img-element */

import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductService } from "../demo/service/ProductService";
import { LayoutContext } from "../layout/context/layoutcontext";
import Link from "next/link";
import { Demo } from "../types/types";
import { ChartData, ChartOptions } from "chart.js";
import { fetchOrdersData, fetchReviewsData, fetchUsersData } from "./api/fetch-data";
import { Orders, Reviews, Users } from "../types/interface";

const lineData: ChartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "#2f4860",
      borderColor: "#2f4860",
      tension: 0.4,
    },
    {
      label: "Second Dataset",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "#00bb7e",
      borderColor: "#00bb7e",
      tension: 0.4,
    },
  ],
};

const Dashboard = () => {

  const formatCurrency = (value: number) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const [users, setUsers] = useState<Users[]>([])
  const [orders, setOrders] = useState<Orders[]>([])
  const [review, setReview] = useState<Reviews[]>([])


  const sortedOrders = [...orders].sort((a, b) => {
    if (a.id > b.id) {
      return -1;
    } else if (a.id < b.id) {
      return 1;
    } else {
      return 0;
    }
  });


  const sortedUsers = [...users].sort((a, b) => {
    if (a.id > b.id) {
      return -1;
    } else if (a.id < b.id) {
      return 1;
    } else {
      return 0;
    }
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUsersData();
        const ordersData = await fetchOrdersData();
        const reviewsData = await fetchReviewsData();

        setOrders(ordersData as unknown as Orders[]);

        setUsers(userData as unknown as Users[]);

        setReview(reviewsData as unknown as Reviews[])
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();

  }, []);


  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 text-xl font-medium mb-3">คำสั่งซื้อ</span>
              <div className="text-900 font-medium text-xl">{orders.length} order</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>

        </div>
      </div>

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 text-lg font-medium mb-3">ผู้ใช้งานแอพ</span>
              <div className="text-900 font-medium text-xl">{users.length} user</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 text-lg  font-medium mb-3">รีวิวทั้งหมด</span>
              <div className="text-900 font-medium text-xl">{review.length} review</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>

        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>คำสั่งซื้อล่าสุด</h5>
          <DataTable
            value={sortedOrders}
            rows={5}
            paginator
            responsiveLayout="scroll"
          >
            <Column
              header="รหัสคำสั่งชื้อ"
              field="id"
              sortable

              body={(rowData) => <div>order-ID-{rowData.id}</div>}
            />
            <Column field="title" header="แพ็คเกจ" body={(rowData) => <div className="line-clamp-2 w-12rem">{rowData.title}</div>}></Column>
            <Column
              field="price"
              header="ราคาแพ็คเกจ"
              sortable
              style={{ width: "35%" }}
              body={(data) => formatCurrency(data.price)}
            />
            <Column
              header="View"
              style={{ width: "15%" }}
              body={() => (
                <>
                  <Link href="/uikit/floatlabel"  >
                    <Button icon="pi pi-search" text />
                  </Link>
                </>
              )}
            />
          </DataTable>
        </div>

      </div>
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>ผู้ใช้งานล่าสุด</h5>
          <DataTable
            value={sortedUsers}
            rows={5}
            paginator
            responsiveLayout="scroll"
          >
            <Column
              header="รหัสID"
              field="id"
              sortable
              body={(rowData) => <div>users-ID-{rowData.id}</div>}
            />
            <Column field="firstName" header="ชื่อ-นามสกุล" body={(rowData) => <div className="line-clamp-1 w-10rem">{rowData.firstName} {rowData.lastName}</div>}></Column>
            <Column
              field="email"
              header="อีเมล"
              style={{ width: "35%" }}
              body={(rowsData) => <div className="line-clamp-1 w-8rem">{rowsData.email}</div>}
            />
            <Column
              field="phoneNumber"
              header="เบอร์โทรศัพทร์"

              style={{ width: "35%" }}
              body={(rowsData) => <div className="line-clamp-1" >{rowsData.phoneNumber}</div>}
            />
            <Column
              header="View"
              style={{ width: "15%" }}
              body={() => (
                <>
                  <Link href="/uikit/users"  >
                    <Button icon="pi pi-search" text />
                  </Link>
                </>
              )}
            />
          </DataTable>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
