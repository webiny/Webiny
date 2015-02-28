import BaseModule from '/Core/Base/BaseModule'

import TableCmp from '/Apps/Core/Table/Js/Components/Table/Table';
import Tbody from '/Apps/Core/Table/Js/Components/Tbody/Tbody';
import Thead from '/Apps/Core/Table/Js/Components/Thead/Thead';
import Tfoot from '/Apps/Core/Table/Js/Components/Tfoot/Tfoot';
import Tr from '/Apps/Core/Table/Js/Components/Tr/Tr';
import Th from '/Apps/Core/Table/Js/Components/Th/Th';
import Td from '/Apps/Core/Table/Js/Components/Td/Td';

class Table extends BaseModule {

	registerComponents() {
		return {
			Table: TableCmp,
			Tbody: Tbody,
			Thead: Thead,
			Tfoot: Tfoot,
			Tr: Tr,
			Td: Td,
			Th: Th
		}
	}
}

export default Table;