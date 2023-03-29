import DashboardLayout from "@/layouts/dashboard";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { BiCopy } from 'react-icons/bi';
import { toast } from "react-toastify";
const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
});

const columns = [
    {
        name: 'shortened',
        selector: (row: any) => <div style={{display:'flex',alignItems:'center',cursor:'pointer'}} >
            <div>
                {row.hash}
            </div>
            <div style={{marginLeft:'5px',fontSize:'20px'}} onClick={()=>{
                navigator.clipboard.writeText(row.hash)
                toast.success('copied to clipboard')
            }} >
                <BiCopy />
            </div>
        </div>
    },
    {
        name: 'original',
        selector: (row: any) => <div>
            <span id={`anchor-id-${row.id}`}>
                {`${row.url.slice(0, 50)}...`}
            </span>
            <ReactTooltip
                data-tooltip-id={`anchor-id-${row.id}`}
                anchorId={`anchor-id-${row.id}`}
                place="bottom"
                content={row.url}
            />
        </div>,
    },
];

const tableDataItems = [
    {
        id: 1,
        hash: 'https://localhost:4001/123',
        url: 'https://facebook.com',
    },
    {
        id: 2,
        hash: 'https://localhost:4001/1asd',
        url: 'https://stackoverflow.com/questions/59475858/next-js-single-page-application',
    }
]
function Table() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(tableDataItems);

    const handleRowSelected = useCallback((state: any) => {
        setSelectedRows(state.selectedRows);
    }, []);
    // @ts-ignore
    const Button = ({ children, etc }) => {
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
        <DataTable
            title="Shortened URLs"
            columns={columns}
            data={data}

            // paginationPerPage={10}
            // paginationTotalRows={123}
            onChangePage={(args) => {
                console.log(args)
                console.log(` --- on change page ---`)
            }}
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            pagination
            paginationServer={false}
        />
    )
}

export default Table;