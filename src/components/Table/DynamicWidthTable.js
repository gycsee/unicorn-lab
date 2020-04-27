import React, { Component } from 'react';
import { CellMeasurer, CellMeasurerCache, Table, Column } from 'react-virtualized';
import { withStyles } from 'react-jss';
import classnames from 'classnames';

const styles = {
  grid: {
    outline: 'none',
  },
  headerRow: {
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#8b9dbc',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  evenRow: {
    backgroundColor: '#dfe5eb',
  },
  tableColumn: {
    padding: '5px 15px 5px 0',
    textTransform: 'none',
  },
  headerClassName: {
    textTransform: 'none',
  },
  pre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
}

class DynamicHeightTableColumn extends Component {
  constructor(props) {
    super(props);
    this._cache = new CellMeasurerCache({
      fixedHeight: true,
      minWidth: 60,
      defaultWidth: 60,
    });
  
    this._lastRenderedWidth = this.props.width;
  }

  _cellRenderer = ({columnIndex, key, parent, rowIndex, cellData, style}) => {
    const { classes } = this.props;
    const classNames = classnames(classes.tableRow, { [classes.rowIndex]: rowIndex % 2 === 1 })
    return (
      <CellMeasurer
        key={key}
        cache={this._cache}
        columnIndex={columnIndex}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className={classNames}
          style={{
            ...style,
            height: 35,
            whiteSpace: 'nowrap',
          }}>
          {cellData}
        </div>
      </CellMeasurer>
    );
  }

  _rowGetter = ({ index }) => {
    const { list } = this.props;
    return list[index];
  };

  _cellDataGetter = ({ rowData, dataKey }) => {
    return rowData.get(dataKey);
  }

  _columnsRenderer = () => {
    const { list, flexGrowColumns = [] } = this.props;
    if (list.length > 0) {
      const columnKeys = Object.keys(list[0]);
      debugger
      return columnKeys.map(item => (
        <Column
          key={item}
          dataKey={item}
          label={item}
          width={100}
          flexGrow={flexGrowColumns.includes(item) ? 1 : 0}
          cellRenderer={this._cellRenderer}
        />
      ))
    } else {
      return [];
    }
  }

  _rowClassName = ({ index }) => {
    const { classes } = this.props;
    if (index < 0) {
      return classes.headerRow;
    } else {
      return classnames(classes.tableRow, { [classes.evenRow]: index % 2 === 1 });
    }
  }

  render() {
    const { list, width, classes } = this.props;
    console.log(list);
    if (this._lastRenderedWidth !== this.props.width) {
      this._lastRenderedWidth = this.props.width;
      this._cache.clearAll();
    }
    return (
      <Table
        gridClassName={classes.grid}
        deferredMeasurementCache={this._cache}
        headerHeight={50}
        headerClassName={classes.headerClassName}
        height={500}
        width={width}
        overscanRowCount={2}
        rowHeight={44}
        rowGetter={this._rowGetter}
        rowCount={list.length}
        rowClassName={this._rowClassName}
        {...this._columnsRenderer()}
      />
    );
  }
}

export default withStyles(styles)(DynamicHeightTableColumn);
