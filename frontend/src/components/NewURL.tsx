

import { AppContext } from '@/app/page';
import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import './NewURL.css' ;

function NewURL(){

    const [url,setUrl] = useState('')
    // @ts-ignore
    const {context,setContext} = useContext(AppContext)
    return (
        <div  className="new_url_main">
            <input type="text" value={url} onChange={(e)=> setUrl(e.target.value)} />
            <button onClick={async ()=>{
                try {

                    // short url 
                    const res = await axios({
                        url : 'http://localhost:4002/api/url/shorten-url',
                        method :'GET',
                        params : {
                            u : url
                        },
                        withCredentials : true 
                    })
                    setUrl('')
                    setContext({
                        ...context ,
                        data : {
                            ...context.data ,
                            totalItems : context.data.totalItems + 1 ,
                            urls : [
                                res.data ,
                                ...context.data.urls 
                            ]
                        }
                    })
                    toast.success(` done `)

                }catch(error){
                    console.log(error)
                    toast.error(` could not shorten url`)
                }
            }} >submit</button>
        </div>
    )
}

export default NewURL ;