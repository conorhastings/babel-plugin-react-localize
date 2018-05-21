import { Text } from 'react-localize';
class X extends React.Component {
    render() {
        return (
            <div>
                <span>
                    {localize("appName")}
                </span>
                <Text message="prop.Val" values={["y"]} style={{ color: 'blue' }} />
            </div>
        );
    }
}