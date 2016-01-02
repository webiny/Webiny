import Component from './../Core/Core/Component';

import Placeholder from './Router/Placeholder';
import Link from './Router/Link';
import Row from './Grid/Row';
import Col from './Grid/Col';

import Table from './Table/Table';
import TableActionEdit from './Table/Action/Edit';
import TableActionDelete from './Table/Action/Delete';
import TableActionMenu from './Table/Action/Menu';
import TableFieldToggle from './Table/Field/Toggle';

import Pagination from './Pagination';

import ModalDialog from './Modal/Dialog';
import ModalHeader from './Modal/Header';
import ModalBody from './Modal/Body';
import ModalFooter from './Modal/Footer';
import ModalPlaceholder from './Modal/Placeholder';
import ModalConfirmation from './Modal/Confirmation';

import FormValidator from './Form/Validation/FormValidator';
import FormVertical from './Form/FormVertical';
import FormHorizontal from './Form/FormHorizontal';
import FormActionSubmit from './Form/Action/Submit';
import FormActionReset from './Form/Action/Reset';
import FormActionCancel from './Form/Action/Cancel';
import FormFieldSet from './Form/FieldSet';
import FormLegend from './Form/Legend';
import FormButton from './Form/Button';
import FormInput from './Form/Input/Input';
import FormStaticField from './Form/StaticField/StaticField';
import FormPassword from './Form/Password/Input';
import FormDateTime from './Form/DateTime/DateTime';
import FormDate from './Form/DateTime/Date';
import FormTime from './Form/DateTime/Time';
import FormTextarea from './Form/Textarea/Textarea';
import FormList from './Form/List/List';
import FormSelect2 from './Form/Select2/Select2';
import FormSelect2Component from './Form/Select2/Select2Component';
import FormCountrySelect2 from './Form/Select2/Country';
import FormRangeSelect2 from './Form/Select2/Range';
import FormMonthSelect2 from './Form/Select2/Month';
import FormSearch from './Form/Search/Search';
import FormSwitch from './Form/Switch/Switch';
import FormCheckbox from './Form/Checkbox/Checkbox';
import FormCheckboxGroup from './Form/Checkbox/CheckboxGroup';
import FormRadioGroup from './Form/Radio/RadioGroup';
import FormGoogleMap from './Form/Google/Map';
import FormEditor from './Form/Editor/Editor';
import FormCreditCardExpiration from './Form/CreditCardExpiration/CreditCardExpiration';
import FormComponent from './Form/Base/FormComponent';
import InputComponent from './Form/Base/InputComponent';

import FormFileReader from './Form/Files/FileReader';
import FormFileCropper from './Form/Files/FileCropper';
import FormFileUploader from './Form/Files/FileUploader';
import FormImage from './Form/Files/Image';
import FormAvatar from './Form/Files/Avatar';
import FormImages from './Form/Files/Images';
import FormFile from './Form/Files/File';

import PanelBody from './Panel/Body';
import PanelFooter from './Panel/Footer';
import PanelHeader from './Panel/Header';
import PanelMenu from './Panel/Menu';
import PanelPanel from './Panel/Panel';

import {Tabs,Tab} from './Tabs/Tabs';

import Filter from './Filter';
import Countries from './Countries';

import DropdownMenu from './Dropdown/Menu';
import DropdownItem from './Dropdown/Item';

import Alert from './Alert';
import Icon from './Icon';
import Image from './Image';

import Well from './Well';
import HorizontalRule from './HorizontalRule';
import Progress from './Progress';
import Loader from './Loader';
import Downloader from './Downloader';
import Hide from './Hide';
import Wizard from './Wizard';

export default {
	Router: {
		Placeholder,
		Link
	},
	Grid: {
		Row,
		Col
	},
	Modal: {
		Dialog: ModalDialog,
		Header: ModalHeader,
		Body: ModalBody,
		Footer: ModalFooter,
		Placeholder: ModalPlaceholder,
        Confirmation: ModalConfirmation
	},
	Form: {
		Action: {
			Submit: FormActionSubmit,
			Reset: FormActionReset,
			Cancel: FormActionCancel
		},
		Validator: FormValidator,
		Vertical: FormVertical,
		Horizontal: FormHorizontal,
		FieldSet: FormFieldSet,
		Legend: FormLegend,
		Button: FormButton,
		Input: FormInput,
		StaticField: FormStaticField,
		Password: FormPassword,
		DateTime: FormDateTime,
		Date: FormDate,
		Time: FormTime,
		Textarea: FormTextarea,
        List: FormList,
		Editor: FormEditor,
		CreditCardExpiration: FormCreditCardExpiration,
		Select2: FormSelect2,
        Select2Component: FormSelect2Component,
        CountrySelect2: FormCountrySelect2,
        RangeSelect2: FormRangeSelect2,
        MonthSelect2: FormMonthSelect2,
        Google: {
            Map: FormGoogleMap
        },
		Search: FormSearch,
		Switch: FormSwitch,
		Checkbox: FormCheckbox,
		CheckboxGroup: FormCheckboxGroup,
		RadioGroup: FormRadioGroup,
		Files: {
			FileReader: FormFileReader,
			FileUploader: FormFileUploader,
			FileCropper: FormFileCropper,
			Image: FormImage,
			Images: FormImages,
			Avatar: FormAvatar,
			File: FormFile
		},
		Base: {
			FormComponent,
			InputComponent
		}
	},
	Panel: {
		Body: PanelBody,
		Footer: PanelFooter,
		Header: PanelHeader,
		Menu: PanelMenu,
		Panel: PanelPanel
	},
	Tabs: {
		Tabs,
		Tab
	},
	Pagination,
	Table : {
        Table,
        Action: {
            Menu: TableActionMenu,
            Edit: TableActionEdit,
            Delete: TableActionDelete
        },
        Field: {
            Toggle: TableFieldToggle
        }
    },
    Alert,
    Countries,
    Filter,
	Icon,
	Image,
	Well,
	HorizontalRule,
	Progress,
	Loader,
	Downloader,
	Hide,
	Dropdown: {
		Menu: DropdownMenu,
		Item: DropdownItem
	},
	Wizard
};