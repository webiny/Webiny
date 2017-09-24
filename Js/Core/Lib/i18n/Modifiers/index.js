// Built-in modifiers
import CountModifiers from './CountModifier';
import GenderModifier from './GenderModifier';
import IfModifier from './IfModifier';
import PluralModifier from './PluralModifier';

export default [
    new CountModifiers(),
    new GenderModifier(),
    new IfModifier(),
    new PluralModifier()
];