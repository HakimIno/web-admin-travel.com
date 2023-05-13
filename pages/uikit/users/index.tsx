import React from 'react'
import { TableUser } from './sections/table-users'

const Users = () => {
    return (
        <div className="grid" style={{ justifyContent: 'center' }}>
            <div className="col-12">
                <div className="card p-fluid">
                    <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>ผู้ใช้งาน</h5>

                    <TableUser />
                </div>
            </div>
        </div>
    )
}

export default Users