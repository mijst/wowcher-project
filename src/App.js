import React, {useEffect, useState} from "react";

import "./App.css";

const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState();
  const [apiData, setApiData] = useState([]);
  const [search,setSearch] = useState('')

  const handleChange = (e) => {
    setSearch(e.target.value)
  }
  
  const filterData = (data) => {
        data.sort((a,b)=>{
        if (a.name < b.name) {return -1;}
        if (a.name > b.name) {return 1;}
        return 0
      })
      var updatedArray = [data[0]]
      var amount = data[0].unitPrice * data[0].sold
      for (var i = 1; i < data.length; i++) {
        if (data[i-1].name !== data[i].name) {
          updatedArray.push(data[i]);
        } else {
          data[i-1].sold += data[i].sold
        }
        amount += data[i].unitPrice * data[i].sold
      }
      setApiData(updatedArray)
      setTotalAmount(amount)
  }
  useEffect(() => {
    Promise.all([
      fetch('api/branch1.json').then((res) => res.json()),
      fetch('api/branch2.json').then((res) => res.json()),
      fetch('api/branch3.json').then((res) => res.json()) 
    ])
    .then(res => [...new Set([...res[0].products,...res[1].products,...res[2].products])])
    .then(data => filterData(data))
    .then(()=>setLoading(false))
    },[])
    return isLoading ? "Loading..." : (
      <div className="product-list">
        <div class="custom-shape-divider-top-1673282561">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
          </svg>
        </div>
      <div className="header-title">KHAJIT HAS WARES,</div>
      <h2> ...if you have coin</h2>
      <label>Search Products</label>
      <input type="text" onChange={handleChange } value={search} placeholder="Search" />
        <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
        {
          apiData.filter(item => item.name.toLowerCase().includes(search)).map(filteredItem=> {
            return <tr key={filteredItem.name}>
              <td>{filteredItem.name}</td>
              <td>{'£'+formatNumber(filteredItem.unitPrice * filteredItem.sold)}</td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>
            {
              search.length < 1 ? 
              '£'+formatNumber(totalAmount) :
              '£'+formatNumber(apiData.filter(item => item.name.toLowerCase().includes(search)).reduce((acc,obj) => acc + obj.unitPrice * obj.sold, 0))
              }
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
