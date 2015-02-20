import ComponentSkeleton from '/Core/Component/ComponentSkeleton';

export default class ComponentFactory {

	static createComponent(self){
		return ComponentSkeleton(self);
	}
}