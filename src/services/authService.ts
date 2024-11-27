import { supabase } from "./supabaseClient"

export const checkUser = async (id: string) => {
  try {
    let { data, error } : { data: any, error: any} = await supabase
    .from('users')
    .select('id, username')
    .eq('id', id)
    .single()
    
    if(!data) {
     throw new Error(error)
    }
   
    return data

  }catch (error) {
    console.log(error)
  }
}