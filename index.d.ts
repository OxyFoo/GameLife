import 'react-native';

declare module 'react-native' {
    namespace StyleSheet {
        export function create<T, S extends NamedStyles<S> | NamedStyles<any>>(styles: T | NamedStyles<S>): T & S;
    }
}
