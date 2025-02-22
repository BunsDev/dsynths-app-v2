import React, { useMemo } from 'react'
import styled from 'styled-components'
import Fuse from 'fuse.js'
import { useSelect, SelectSearchOption } from 'react-select-search'

import { useLongAssetsList } from 'hooks/useAssetList'
import useDefaultsFromURL from 'state/trade/hooks'
import { Search as SearchIcon } from 'components/Icons'
import { Sector } from 'state/details/reducer'
import { FALLBACK_CHAIN_ID } from 'constants/chains'

const SearchWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  background: ${({ theme }) => theme.bg1};
  border-radius: 10px;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 0.8rem;
  border: 1px solid ${({ theme }) => theme.border2};
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: 40px;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text1};

  &:focus,
  &:hover {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.9rem;
  `}
`

function fuzzySearch(options: SelectSearchOption[]): any {
  const config = {
    keys: ['ticker', 'name'],
    isCaseSensitive: false,
    threshold: 0.2,
  }

  const fuse = new Fuse(options, config)

  return (query: string) => {
    if (!query) {
      return options
    }

    const result = fuse.search(query)
    return result.map((o) => o.item)
  }
}

export function useSearch(selectedSector: Sector) {
  const assetList = useLongAssetsList(FALLBACK_CHAIN_ID)
  const { setURLCurrency } = useDefaultsFromURL()

  const assets: SelectSearchOption[] = useMemo(() => {
    return assetList.filter((o) => o.sector === selectedSector).map((o) => ({ ...o, value: o.contract }))
  }, [assetList, selectedSector])

  const [snapshot, searchProps, optionProps] = useSelect({
    options: assets,
    value: '',
    search: true,
    filterOptions: fuzzySearch,
    allowEmpty: true,
    closeOnSelect: false,
  })

  return {
    setURLCurrency,
    snapshot,
    searchProps,
    optionProps,
  }
}

export function InputField({ searchProps, placeholder }: { searchProps: any; placeholder: string }) {
  return (
    <SearchWrapper>
      <Input
        {...searchProps}
        title="Search a ticker"
        autoFocus
        type="text"
        placeholder={placeholder}
        spellCheck="false"
        onBlur={() => null}
      />
      <SearchIcon size={20} />
    </SearchWrapper>
  )
}
