
import {useState} from 'react';


// You can either build “top down” by starting with 
// building the components higher up in the hierarchy 
// (like FilterableProductTable) or “bottom up” by 
// working from components lower down (like 
// ProductRow). In simpler examples, it’s usually 
// easier to go top-down, and on larger projects, 
// it’s easier to go bottom-up.
function ProductCategoryRow({category}) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({product}) {
  const name = product.stocked ?
    <span style={{color: 'green'}}>
      {product.name}
    </span>
    :
    <span style={{color: 'red'}}>
      {product.name}
    </span>;
  // ^^^ conditional operator, translates as
  // if product is stocked, name will contain the span
  // styled green, else it will contain the span styled red

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    )
}


// ProductTable will use the state of the search text
function ProductTable({
  products,
  filterText,
  inStockOnly
}) {
  const rows = [];
  // ^^^ here we will store al the rows of our table
  let lastCategory = null;
  // ^^^ we save the last category of the last product
  // to see if we need to also insert the category row
  
  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }

    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow 
        category={product.category}
        key={product.category} />
      );
    }
  // ^^^ we assume that our products are ordered by category
  // in this way, we can insert the category row every time
  // the category of the current product is different than
  // the category of the last product

    rows.push(
      <ProductRow
      product={product}
      key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}


// SearchBar needs to display the state of the
// search text and checkbox value
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      {/* The search text is a state since it changes
      over time and can't be computed from anything */}
      <input 
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)} />

      <label>
        {/* The value of the checkbox is a state since
        it changes over time and can't be computed from
        anything */}
        <input 
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}


// This is the common parent of the components that will
// use states, so this is the component where the states live
function FilterableProductTable({products}) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar 
      filterText={filterText}
      inStockOnly={inStockOnly}
      onFilterTextChange={setFilterText}
      onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
      products={products}
      filterText={filterText}
      inStockOnly={inStockOnly} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];


export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
