import React from 'react';
import { CellMeasurer, CellMeasurerCache, MultiGrid } from 'react-virtualized';
import { withStyles } from 'react-jss';
import classnames from 'classnames';

const styles = {
  BodyGrid: {
    outline: 'none',
    width: '100%',
    border: '1px solid #e0e0e0',
  },
  evenRow: {
    borderBottom: '1px solid #e0e0e0',
  },
  oddRow: {
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
  },
  cell: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyDontent: 'center',
    padding: '0.5em 1em',
    borderRight: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
  },
}


class DynamicWidthMultiGrid extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this._cache = new CellMeasurerCache({
      defaultWidth: 100,
      defaultHeight: 35,
      fixedHeight: true,
    });
  }
  
  getClassName = ({columnIndex, rowIndex}) => {
    const { classes } = this.props;
    const rowClass = rowIndex % 2 === 0 ? classes.evenRow : classes.oddRow;
  
    return classnames(rowClass, classes.cell, {
      [classes.centeredCell]: columnIndex > 2,
    });
  }

  _cellRenderer = ({columnIndex, isScrolling, key, parent, rowIndex, style}) => {
    const { list } = this.props;
    const classname = this.getClassName({columnIndex , rowIndex});
    const content = isScrolling ? '...' : list[rowIndex][columnIndex];

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}>
        <div
          className={classname}
          style={{
            ...style,
            height: 35,
            whiteSpace: 'nowrap',
          }}>
          {content}
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const { list, columnCount, width, classes } = this.props;

    return (
      <MultiGrid
        className={classes.BodyGrid}
        columnCount={columnCount}
        columnWidth={this._cache.columnWidth}
        deferredMeasurementCache={this._cache}
        height={600}
        fixedColumnCount={0}
        fixedRowCount={1}
        overscanColumnCount={0}
        overscanRowCount={2}
        cellRenderer={this._cellRenderer}
        rowCount={list.length}
        rowHeight={35}
        width={width}
      />
    );
  }
}


export default withStyles(styles)(DynamicWidthMultiGrid);
