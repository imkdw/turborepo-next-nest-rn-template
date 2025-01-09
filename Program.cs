using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;

class Program
{
    private const string TARGET_BUTTON_NAME = "btnFood";
    private const string TARGET_PROCESS = "TestButton";
    private static string webUrl = "https://www.google.com";
    private static IntPtr hookId = IntPtr.Zero;

    [DllImport("user32.dll")]
    static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll")]
    static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll")]
    static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll")]
    static extern IntPtr GetModuleHandle(string lpModuleName);

    [DllImport("user32.dll")]
    static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    static extern int GetClassName(IntPtr hWnd, System.Text.StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll")]
    static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT
    {
        public int x;
        public int y;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct MSLLHOOKSTRUCT
    {
        public POINT pt;
        public uint mouseData;
        public uint flags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    private static LowLevelMouseProc _proc = HookCallback;

    static void Main()
    {
        hookId = SetHook(_proc);
        Console.WriteLine("후킹 시작됨. 종료하려면 아무 키나 누르세요...");
        Console.ReadKey();
        UnhookWindowsHookEx(hookId);
    }

    private static IntPtr SetHook(LowLevelMouseProc proc)
    {
        using (Process curProcess = Process.GetCurrentProcess())
        using (ProcessModule curModule = curProcess.MainModule)
        {
            return SetWindowsHookEx(14, proc, GetModuleHandle(curModule.ModuleName), 0);
        }
    }

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && wParam == (IntPtr)0x0201) // WM_LBUTTONDOWN
        {
            MSLLHOOKSTRUCT hookStruct = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
            POINT pt = hookStruct.pt;
            IntPtr hwnd = WindowFromPoint(pt);

            var className = new System.Text.StringBuilder(256);
            var windowText = new System.Text.StringBuilder(256);
            GetClassName(hwnd, className, 256);
            GetWindowText(hwnd, windowText, 256);

            if (className.ToString() == "Button" && windowText.ToString() == "먹거리주문")
            {
                Process[] processes = Process.GetProcessesByName(TARGET_PROCESS);
                if (processes.Length > 0)
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = webUrl,
                        UseShellExecute = true
                    });
                    return (IntPtr)1; // 원래 이벤트 무시
                }
            }
        }
        return CallNextHookEx(hookId, nCode, wParam, lParam);
    }
}