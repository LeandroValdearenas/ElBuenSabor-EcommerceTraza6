
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CircularProgress } from "@nextui-org/react";

type Props = {
  component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: Props) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="w-100 d-flex justify-content-center mt-5"><CircularProgress /></div>
    ),
  });

  return <Component />;
};