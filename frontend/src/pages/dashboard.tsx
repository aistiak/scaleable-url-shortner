
import DashboardLayout from "@/layouts/dashboard";
import { useCallback, useMemo, useState } from "react";
import DataTable from 'react-data-table-component';
const columns = [
    {
        name: 'Title',
        selector: row => row.title,
    },
    {
        name: 'Year',
        selector: row => row.year,
    },
];

const tableDataItems = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

function Dashboard() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(tableDataItems);

    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);
    // @ts-ignore
    const Button = ({children,etc}) => {
        return (
            <button {...etc}>{children}</button>
        )
    }
    const contextActions = useMemo(() => {
        const handleDelete = () => {

            // if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
            //     setToggleCleared(!toggleCleared);
            //     setData(differenceBy(data, selectedRows, 'title'));
            // }
        };

        return (
            // @ts-ignore
            <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>
                Delete
            </Button>
        );
    }, [data, selectedRows, toggleCleared])
    return (
        <DashboardLayout>
            <div>
                <DataTable
                    title="Shortened URLs"
                    columns={columns}
                    data={data}
                    
                    // paginationPerPage={10}
                    // paginationTotalRows={123}
                    onChangePage={(args)=>{
                        console.log(args)
                    }}
                    selectableRows
                    contextActions={contextActions}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    pagination
                />
            </div>
        </DashboardLayout>
    )
}

export default Dashboard;

