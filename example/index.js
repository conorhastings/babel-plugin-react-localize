import { Text } from 'react-localize';
class X extends React.Component {
    static contextTypes = {
        localize: PropTypes.func
    }

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