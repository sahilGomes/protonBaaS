export default function Searchbar({ value, placeholder, changeSearchvalue,inputWidth }) {
  function handleinput(e) {
    changeSearchvalue(e.target.value);
  }

  return (
    <div className="h-[75px] flex justify-center items-center border-b-[1px]">
      <input type="text" placeholder={placeholder} value={value} onChange={handleinput} className={`input input-bordered w-[${inputWidth}] h-[35px]`} />
    </div>
  )
}