import { useAtomValue, useAtom } from "jotai";
import { tableAtom, tableStore, selectedTableAtom, TableSize } from "../../state/table";
import { useEffect, useState, useRef } from "react";
import { TABLE_SIZE } from "../utils/consts";
import _ from "lodash";
import { connectionsStore } from "../../state/connection";
import { Select, notification } from "antd";

const Table = () => {
  const [tables] = useAtom(tableAtom);
  const selectedTable = useAtomValue(selectedTableAtom);
  const { id, excelRef } = selectedTable ?? {};
  const [formulaValue, setFormulaValue] = useState("");
  const [tableName, setTableName] = useState<string>("");
  const [tableSize, setTableSize] = useState<TableSize>(TABLE_SIZE.DO_NOTHING);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const connections = connectionsStore.getState().connections;
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!id) return;

    const selectedTableData = tables.find((table) => table.id === id);
    if (selectedTableData) {
      setTableName(selectedTableData.name);
      setFormulaValue(selectedTableData.sqlFormula || "");
      setTableSize(selectedTableData.tableSize || TABLE_SIZE.DO_NOTHING);
    } else {
      setTableName("");
      setFormulaValue("");
      setTableSize(TABLE_SIZE.DO_NOTHING);
    }
  }, [tables, id]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    setTableName(updatedName);

    const updatedTables = tables.some((table) => table.id === id)
      ? tables.map((table) =>
          table.id === id ? { ...table, name: updatedName } : table
        )
      : [...tables, { id, name: updatedName }];

    tableStore.setState(_.cloneDeep(updatedTables), true);
  };

  const handleFormulaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFormula = event.target.value;
    setFormulaValue(newFormula);

    const updatedTables = tables.map((table) =>
      table.id === id ? { ...table, sqlFormula: newFormula } : table
    );

    tableStore.setState(_.cloneDeep(updatedTables), true);
  };

  const handleTableSizeChange = (value: TableSize) => {
    setTableSize(value);

    // If "Init and Update once" is selected, we'll update the table size once
    // and then automatically set it to "Do nothing"
    const newSize = value === TABLE_SIZE.UPDATE_ONCE ? TABLE_SIZE.DO_NOTHING : value;

    const updatedTables = tables.map((table) =>
      table.id === id ? { ...table, tableSize: newSize } : table
    );

    tableStore.setState(_.cloneDeep(updatedTables), true);
  };

  return (
    <div className="table-container">
      {contextHolder}
      {id ? (
        <div className="filter-content">
          <div className="filters">
            <div className="flex-1">
              <label className="label">Table Name</label>
              <div className="flex items-center">
                <input
                  value={tableName}
                  onChange={handleNameChange}
                  placeholder="Table Name"
                  className="modified"
                />
              </div>
              <div>Selected Cell: {excelRef}</div>
            </div>
          </div>
        </div>
      ) : (
        <p>Please select a table to get started.</p>
      )}
      <div className="value">
        <div className="d-flex justify-between">
          <p>SQL Formula</p>
        </div>
        <Select
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="Select a connection"
          options={connections.map(conn => ({
            value: conn.name,
            label: `${conn.name} (${conn.type})`
          }))}
        />
        <textarea
          ref={textareaRef}
          className="p-1"
          value={formulaValue}
          onChange={handleFormulaChange}
          placeholder='Enter your SQL formula here (e.g., SQL("MySQLConnection", "SELECT * FROM TABLE WHERE X > Y LIMIT 10"))'
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '8px',
            fontSize: '16px',
            fontFamily: 'monospace'
          }}
        />
      </div>
      <div className="scope mt-4 mx-3">
        <span>SQL Table Size</span>
        <div className="flex items-center mx-3">
          Always Update
          <input
            className="radio-input"
            type="radio"
            name="table-size"
            checked={tableSize === TABLE_SIZE.ALWAYS_UPDATE}
            onChange={() => handleTableSizeChange(TABLE_SIZE.ALWAYS_UPDATE)}
          />
        </div>
        <div className="flex items-center mx-3">
          Init and Update once
          <input
            className="radio-input"
            type="radio"
            name="table-size"
            checked={tableSize === TABLE_SIZE.UPDATE_ONCE}
            onChange={() => handleTableSizeChange(TABLE_SIZE.UPDATE_ONCE)}
          />
        </div>
        <div className="flex items-center mx-3">
          Do nothing
          <input
            className="radio-input"
            type="radio"
            name="table-size"
            checked={tableSize === TABLE_SIZE.DO_NOTHING}
            onChange={() => handleTableSizeChange(TABLE_SIZE.DO_NOTHING)}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;