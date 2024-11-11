import { useRef } from 'react';
import IconSearch from 'assets/search.svg';
import { useDispatch } from 'react-redux';
import { setSearchString } from 'reduxStore/actions/search';
import 'components/searchBar/searchBar.scss';

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className='search'>
      <div className='search-bar'>
        <span>
          <img src={IconSearch} alt={'Search Icon'} />
        </span>
        <input
          onChange={(e) => {
            if (e.target.value === '') {
              dispatch(setSearchString(''));
            }
          }}
          ref={searchRef}
          type='search'
          placeholder='Search for Products'
        />
      </div>
      <button onClick={() => dispatch(setSearchString(searchRef.current?.value ?? ''))}>
        Search
      </button>
    </div>
  );
}
