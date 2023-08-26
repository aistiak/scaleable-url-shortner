import DashboardLayout from "@/layouts/dashboard";
import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { BiCopy } from 'react-icons/bi';
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "@/app/page";
const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
});

const columns = [
    {
        name: 'shortened',
        selector: (row: any) => <div style={{display:'flex',alignItems:'center',cursor:'pointer'}} >
            <div>
                {`http://localhost:4001/${Number(row?.hash)?.toString(16)}`}
            </div>
            <div style={{marginLeft:'5px',fontSize:'20px'}} onClick={()=>{
                navigator.clipboard.writeText(`http://localhost:4001/${Number(row?.hash)?.toString(16)}`)
                toast.success('copied to clipboard')
            }} >
                <BiCopy />
            </div>
        </div>
    },
    {
        name: 'original',
        selector: (row: any) => <div>
            <span id={`anchor-id-${row._id}`}>
                {`${row?.url?.slice(0, 50)}...`}
            </span>
            <ReactTooltip
                data-tooltip-id={`anchor-id-${row._id}`}
                anchorId={`anchor-id-${row._id}`}
                place="bottom"
                content={row.url}
            />
        </div>,
    },
];

const tableDataItems = [
    // {
    //     id: 1,
    //     hash: 'https://localhost:4001/123',
    //     url: 'https://facebook.com',
    // },
    // {
    //     id: 2,
    //     hash: 'https://localhost:4001/1asd',
    //     url: 'https://stackoverflow.com/questions/59475858/next-js-single-page-application',
    // }
]
function Table() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    // @ts-ignore
    const {context,setContext} = useContext(AppContext)


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


    const getData = async (page=1) => {
        try {

            const res :any = await axios({
                url : 'http://localhost:4002/api/url/user-urls',
                method : `GET`,
                withCredentials : true 
            })
            console.log(res)
            const {
                urls, 
                currentPage, 
                perPage, 
                totalItems 
            } = res?.data ;

            return {
                success : true ,
                urls, 
                currentPage, 
                perPage, 
                totalItems 
            }
        }catch(error){
            console.log(error)
            console.log(` --- an exception occurren in getData ---`)
            return {success : false }
        }
    }
    useEffect(()=>{
        (async ()=>{
            const {
                success ,
                urls, 
                currentPage, 
                perPage, 
                totalItems 
            } = await getData()
            if(!success) toast.error(` colud not fetch data`)
            // toast.success(`success`)
            // setData(urls)
            // setTotalItems(totalItems)

            setContext({
                ...context ,
                data : {
                    urls ,
                    totalItems
                }
            })
        })()
    },[])
    const handlePageChange = async (arg : number) => {
        console.log({arg})
    }
    return (
        <>
        {/* {JSON.stringify(context.data.totalItems)} */}
        <DataTable
            title="Shortened URLs"
            // @ts-ignore
            columns={columns}
            data={context?.data?.urls || []}
            paginationRowsPerPageOptions={[8]}
            paginationPerPage={8}
            paginationTotalRows={context?.data?.totalItems || 0}
            onChangePage={handlePageChange}
            // progressPending={true}
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            pagination
            paginationServer={false}
        />
        </>
    )
}

export default Table;