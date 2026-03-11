
function AllCenter({ children }: { children: React.ReactElement }){
  return (
    <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'}}>

      {children}

    </div>
  )
}

export default AllCenter