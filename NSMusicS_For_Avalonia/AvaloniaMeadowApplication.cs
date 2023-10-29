using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Avalonia;
using Avalonia.Threading;

using Meadow;

namespace NSMusicS_For_Avalonia
{
    public class AvaloniaMeadowApplication<T> : Application, IApp
        where T : class, IMeadowDevice
    {
        public CancellationToken CancellationToken => throw new NotImplementedException();

        public static T? Device => Resolver.Services.Get<IMeadowDevice>() as T;

        public Dictionary<string, string> Settings => throw new NotImplementedException();

        protected AvaloniaMeadowApplication()
        {
        }

        public override void OnFrameworkInitializationCompleted()
        {
            base.OnFrameworkInitializationCompleted();
        }

        public void InvokeOnMainThread(Action<object?> action, object? state = null)
        {
            Dispatcher.UIThread.Post(() => action(state));
        }

        virtual public Task OnError(Exception e)
        {
            return Task.CompletedTask;
        }

        virtual public Task OnShutdown()
        {
            return Task.CompletedTask;
        }

        virtual public void OnUpdate(Version newVersion, out bool approveUpdate)
        {
            approveUpdate = true;
        }

        virtual public void OnUpdateComplete(Version oldVersion, out bool rollbackUpdate)
        {
            rollbackUpdate = false;
        }

        virtual public Task Run()
        {
            return Task.CompletedTask;
        }

        public virtual Task InitializeMeadow()
        {
            return Task.CompletedTask;
        }

        Task IApp.Initialize()
        {
            return InitializeMeadow();
        }

        protected void LoadMeadowOS()
        {
            new Thread((o) =>
            {
                _ = MeadowOS.Start(this, null);
            })
            {
                IsBackground = true
            }
            .Start();
        }
    }
}
