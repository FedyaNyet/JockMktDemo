import React, { useState } from "react";
import "./css/zero.css";
import "./css/styles.css";
import data from './eventstock.json'

const ASC = 1;
const DESC = -1;
const DEAFULT_SORT = {column:"last_price", direction:DESC};
const DATA = [...data.event_stocks].map(s => {
  s.last_price = parseFloat(s.last_price);
  return s;
})

export const App = () => {

  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState(DEAFULT_SORT);

  let stocks = [...DATA]

  // apply search filter
  if (!!filter) {
    stocks = stocks.filter((ev) => 
      ev.stock.name.toLowerCase().includes(filter.toLowerCase())
    )
  }

  // apply column sort
  if (sort.column === 'name') {
    stocks.sort((s1, s2) => sort.direction * (s1.stock.name>s2.stock.name? 1:-1))
  }
  else {
    stocks.sort((s1, s2) => sort.direction * (s1[sort.column]>s2[sort.column]?1:-1))
  }

  return (
    <div className="app">
      <input placeholder="Search" 
             value={filter} 
             onChange={({target:{value}}) => {setFilter(value)}}/>
      <ul className="eventList">
        <StockEventHeader sort={sort} 
                          onSortChange={setSort}/>
        {stocks.map((ev_stock) => 
          <StockEvent key={ev_stock.id} 
                      event={ev_stock}/>
        )}
      </ul>
    </div>
  );
}

const StockEventHeader = ({sort, onSortChange}) => {

  const updateSort = (column) => {
    if (sort.column !== column) {
      return onSortChange({column, direction: DESC});
    }
    if (sort.direction === DESC) {
      return onSortChange({...sort, direction: ASC});
    }
    else {
      return onSortChange(DEAFULT_SORT);
    }
  }

  const getDirection = (column) => {
    return column === sort.column ? sort.direction : ''
  } 

  return (
    <li className="eventItem">
      {[['name', 'Name'],
        ['fantasy_points_projected', 'Projected Points'], 
        ['fantasy_points_scored', 'Points Scored'],
        ['last_price', 'Price']
      ].map(([column, title]) =>
        <div key={column} onClick={() => updateSort(column)}>
          <strong>
            {title}
            <Arrow direction={getDirection(column)}/>
          </strong>
        </div>
      )}
    </li>
  )
}

const Arrow = ({direction}) => {
  return (
    <span className='arrow'>
      {direction === ASC && '▲'}
      {direction === DESC && '▼'}
    </span>
  );  
}

const StockEvent = ({
  event:{
    stock:{
      image_url,
      name,
    }, 
    fantasy_points_projected, 
    fantasy_points_scored, 
    last_price
  }
}) => (
  <li className="eventItem">
    <img alt={name} src={image_url}/>
    <div>{name}</div>
    <div>{fantasy_points_projected}</div>
    <div>{fantasy_points_scored || '-'}</div>
    <div>{last_price}</div>
  </li>
)

export default App;