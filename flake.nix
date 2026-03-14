{
  description = "FastAPI + UV Python DevShell For Kevin";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        python314
        uv
        stdenv.cc.cc.lib
        zlib
        glib
      ];

      shellHook = ''
        export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath (with pkgs; [stdenv.cc.cc.lib zlib glib])}:$LD_LIBRARY_PATH"

        echo "NixOS DevShell activated!"
        echo "Python version: $(python --version)"
        echo "UV version: $(uv --version)"
        echo "
        echo "Next steps:"
        echo "Run cd backend"
        echo "FIRST TIME: Run 'uv venv' to create the virtual environment"
        echo "Run 'source .venv/bin/activate'"
        echo "Run 'uv pip install -r requirements.txt'"
      '';
    };
  };
}
