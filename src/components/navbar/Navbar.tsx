import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {

    return (
        <div className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between">
                        <Logo />
                        <Search />
                        <UserMenu />
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;
