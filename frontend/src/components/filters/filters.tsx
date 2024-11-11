import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from 'reduxStore/reducers/productsSlice';
import 'components/filters/filters.scss';

function Separater() {
  return <span className='separater'>|</span>;
}

export default function Filters() {
  const dispatch = useDispatch();
  const { filter } = useSelector((state: any) => state.root.products);
  const filters = ['Relevance', 'New', 'Highest Price', 'Lowest Price'];
  const filterNames = ['relevance', 'new', 'highest_price', 'lowest_price'];
  const numOfFilters = filterNames.length;

  return (
    <div className='filters'>
      {filterNames.map((filterName, index) => {
        let styleClass = '';
        if (filterName === filter) {
          styleClass = 'selected';
        }
        return (
          <div key={filterName} className='filter'>
            <span className={styleClass} onClick={() => dispatch(setFilter(filterNames[index]))}>
              {filters[index]}
            </span>
            {index !== numOfFilters - 1 ? <Separater /> : null}
          </div>
        );
      })}
    </div>
  );
}
