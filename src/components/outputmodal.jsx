export default function OutputModal({visible,onSubmit}){

const [output,setOutput] = useState("")

if(!visible) return null

return(

<div className="modal">

<h2>Enter Output Produced</h2>

<input
type="number"
value={output}
onChange={(e)=>setOutput(e.target.value)}
/>

<button onClick={()=>onSubmit(output)}>
Submit
</button>

</div>

)

}