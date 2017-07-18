import {expect} from 'chai';
import sinon from 'sinon';
import {mount} from './../setup';

import Icon from './../../../Js/Core/Ui/Components/Icon';
import Button from './../../../Js/Core/Ui/Components/Button';

describe('Button', () => {
    it('Mounts successfully', () => {
        return mount(<Button icon="fa-money"/>).then(wrapper => {
            expect(wrapper.find('button').exists()).to.equal(true);
        });
    });

    it('Contains given icon element', () => {
        return mount(<Button icon="fa-page"/>).then(wrapper => {
            expect(wrapper.find(Icon).exists()).to.equal(true);
        });
    });

    it('Contains given label', () => {
        return mount(<Button label="Webiny"/>).then(wrapper => {
            expect(wrapper.text()).to.include('Webiny');
        });
    });

    it('Executes callback on click', () => {
        const onButtonClick = sinon.spy();
        return mount(<Button label="Webiny" onClick={onButtonClick}/>).then(wrapper => {
            wrapper.find('button').simulate('click');
            expect(onButtonClick).to.have.property('callCount', 1);
        });
    });
});
