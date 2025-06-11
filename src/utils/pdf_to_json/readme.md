To generate `.exe` files from Python scripts, first install Python and all the required libraries:

```bash
pip install pymupdf pdfplumber pymongo pillow
```

Optionally, install [UPX](https://upx.github.io/) to reduce the final file size.

### Command for **PowerShell (Windows)**:

```powershell
pyinstaller --onefile --upx-dir "C:/PathToUPX" pdf_to_json_stream.py `
  --exclude-module tkinter `
  --exclude-module test `
  --exclude-module asyncio `
  --exclude-module email `
  --exclude-module http `
  --exclude-module xml `
  --exclude-module setuptools `
  --exclude-module doctest
```

### Command for **Linux**:

```bash
pyinstaller --onefile --upx-dir "C:/PathToUPX" pdf_to_json_stream.py \
  --exclude-module tkinter \
  --exclude-module test \
  --exclude-module asyncio \
  --exclude-module email \
  --exclude-module http \
  --exclude-module xml \
  --exclude-module setuptools \
  --exclude-module doctest
```

> 💡 Make sure the `upx` binary is executable (`chmod +x /path/to/upx`) and that `pyinstaller` is installed (`pip install pyinstaller`).
