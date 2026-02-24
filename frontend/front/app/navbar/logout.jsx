import React from 'react'
import axios from "axios"
import { useMyContext } from "../contextprovider/provider"


function Logout() {
  const{ setLogin, setLogDetails}=useMyContext()
  router=useRouter()
  try{
    res=axios.get("http://127.0.0.1:8000/users/logout/")
    setLogin(false)

    router.push("/home")



  }
  catch(error){
    console.log(error)

  }
  
}

export default Logout