import {expect} from 'chai';
import {mount} from './../setup';

import Icon from './../../../Js/Core/Ui/Components/Icon';

describe('Icon', () => {
    it('Mounts successfully', () => {
        return mount(<Icon icon="fa-money"/>).then(wrapper => {
            expect(wrapper.find('span').exists()).to.equal(true);
        });
    });

    it('Contains given CSS class', () => {
        return mount(<Icon icon="fa-page"/>).then(wrapper => {
            expect(wrapper.find('span').hasClass('fa-page')).to.equal(true);
        });
    });
});