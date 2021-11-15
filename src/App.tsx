import React, { useState } from 'react'
import 'antd/dist/antd.css'
import 'bulma/css/bulma.css'
import './App.css'
import { map } from 'lodash'
import leafLogo from './assets/leaf-logo.png'
import { formatCheat } from './utils/formatCheat'
import { ItemShow } from './ItemShow'
import { range } from 'lodash'
import { allItems, ItemsSearch } from './ItemsSearch'
import { AnyItem } from './utils/definitions'
import { Button, message } from 'antd'

interface EmptyItemProps {
  slot: number
  onClick?: () => any
}

function EmptyItem(props: EmptyItemProps) {
  const { onClick = () => { } } = props

  const variant: AnyItem = {
    name: `Empty Slot #${props.slot + 1}`,
    item: {
      name: `Empty Slot #${props.slot + 1}`
    },
    image: leafLogo,
    filename: '',
    uniqueEntryId: '',
    colors: [],
    themes: [],
    source: [],
    internalId: 0,
    buy: 0,
    sell: 0
  }
  return <ItemShow small={true} onClick={onClick} variant={variant} />
}

const cellIndex = (row: number, column: number) => row * 4 + column

interface InventoryGridProps {
  selectedItems: Record<number, AnyItem>
  fillCell: (row: number, col: number) => void
}

function InventoryGrid(props: InventoryGridProps) {
  const { selectedItems, fillCell } = props
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rowIndex) => (
        <div className="tile is-ancestor" key={`row-${rowIndex}`}>
          {[0, 1, 2, 3].map((columnIndex) => (
            <div className="tile is-parent" key={`row-${rowIndex}-column-${columnIndex}`}>
              <div className="tile is-child">
                {selectedItems[cellIndex(rowIndex, columnIndex)] === undefined ? (
                  <EmptyItem onClick={() => fillCell(rowIndex, columnIndex)} slot={cellIndex(rowIndex, columnIndex)} />
                ) : (
                    <ItemShow onClick={() => fillCell(rowIndex, columnIndex)} small={true} variant={selectedItems[cellIndex(rowIndex, columnIndex)]} />
                  )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function Main() {
  const [selectedItem, selectItem] = useState<AnyItem>(allItems[0])
  const [selectedItems, selectItemInCell] = useState<Record<number, AnyItem>>({})

  const nextEmptyIndex = range(40).find((i) => selectedItems[i] === undefined) ?? 0
  const fillIndex = (index: number, item = selectedItem) => selectItemInCell({ ...selectedItems, [index]: item })
  const fillCell = (row: number, column: number, item = selectedItem) => fillIndex(cellIndex(row, column), item)
  const fillEmpty = (item = selectedItem) => {
    message.success(`Added ${item.name} to list [${nextEmptyIndex+1}/40]`)
    fillIndex(nextEmptyIndex, item)
  }
  const selectNext = () => {
    const currentIndex = allItems.indexOf(selectedItem)
    const nextIndex = currentIndex + 1
    if (nextIndex < allItems.length) {
      selectItem(allItems[nextIndex])
    }
  }
  return (
    <>
      <section className="hero is-small is-dark">
        <div className="hero-body">
          <div className="container">
          <img src={leafLogo} className="logo" alt="Animal Crossing New Horizons Leaf" />
            <h1 className="title">
            AC:NH OrderBot Helper
      </h1>
            <h2 className="subtitle">
              <a href="https://github.com/yknx4/yknx4.github.io" target="_blank" rel="noreferrer">Credits to yknx4</a> | V1.0 modified by JayJay
      </h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="columns">
          <aside className="menu column is-one-quarter">
            <div className='container is-fluid'>
              <div className="columns">
                <div className="column">
                  <Button onClick={() => selectNext()}>Select Next</Button>
                </div>
                <div className="column">
                  <Button disabled={Object.values(selectedItems).length >= 40} onClick={() => fillEmpty()}>Fill Next Empty</Button>
                </div>
              </div>
              <ItemShow variant={selectedItem} />
              <ItemsSearch onSecondarySelect={fillEmpty} onSelect={(item) => { selectItem(item) }} />
            </div>
          </aside>
          <div className="column is-three-quarters">
            <InventoryGrid selectedItems={selectedItems} fillCell={fillCell} />
          </div>

        </div>
      </section>

      <section className="section">
        <pre>
          {`%ordercat `}
          {map(selectedItems, (k, v) => formatCheat(k, v))}
        </pre>
      </section>

      <footer className="footer">
        <div className="content has-text-centered"><p>Original code by Ale Ornelas 2020</p>
        <p>Modified by JayJay 2021</p>
        </div>
      </footer>

    </>
  )
}

export default Main
